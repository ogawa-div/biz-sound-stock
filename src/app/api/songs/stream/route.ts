import { NextRequest, NextResponse } from "next/server"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createClient } from "@supabase/supabase-js"

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// R2 client (S3 compatible)
const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const R2_BUCKET = process.env.R2_BUCKET_NAME || "music"

// Subscription check result type
type SubscriptionTier = "premium" | "free" | "none"

interface StreamResponse {
  url: string
  isPreview: boolean
  previewDuration?: number
  expiresAt: number
}

export async function POST(request: NextRequest) {
  try {
    const { songId, userId } = await request.json()

    if (!songId) {
      return NextResponse.json(
        { error: "Song ID is required" },
        { status: 400 }
      )
    }

    // Get song info
    const { data: song, error: songError } = await supabaseAdmin
      .from("songs")
      .select("file_key, title, duration")
      .eq("id", songId)
      .eq("is_active", true)
      .single()

    if (songError || !song) {
      return NextResponse.json(
        { error: "Song not found" },
        { status: 404 }
      )
    }

    // Check subscription status
    let subscriptionTier: SubscriptionTier = "none"
    
    if (userId) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("subscription_status, subscription_plan")
        .eq("id", userId)
        .single()

      if (profile) {
        const status = profile.subscription_status
        if (status === "active" || status === "trialing") {
          subscriptionTier = "premium"
        } else if (status === "none" || status === "canceled") {
          subscriptionTier = "free"
        }
      }
    }

    // Determine access level
    const isPreview = subscriptionTier !== "premium"
    const previewDuration = 30 // 30 seconds for free users

    // Generate signed URL (expires in 1 hour for premium, 5 min for preview)
    const expiresIn = isPreview ? 300 : 3600 // seconds

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: song.file_key,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
    const expiresAt = Date.now() + expiresIn * 1000

    const response: StreamResponse = {
      url: signedUrl,
      isPreview,
      expiresAt,
    }

    if (isPreview) {
      response.previewDuration = previewDuration
    }

    // Log play attempt (for analytics)
    if (userId) {
      await supabaseAdmin.from("play_logs").insert({
        user_id: userId,
        song_id: songId,
        duration_played: 0, // Will be updated on completion
        completed: false,
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Stream API error:", error)
    return NextResponse.json(
      { error: "Failed to generate stream URL" },
      { status: 500 }
    )
  }
}
