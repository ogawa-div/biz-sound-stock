import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { uploadAudioFile } from "@/lib/r2/upload";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string;
    const album = formData.get("album") as string | null;
    const genre = formData.get("genre") as string;
    const mood = formData.get("mood") as string;
    const bpm = formData.get("bpm") as string | null;
    const coverImageUrl = formData.get("cover_image_url") as string | null;

    if (!file || !title || !artist || !genre || !mood) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "audio/mpeg") {
      return NextResponse.json(
        { error: "Invalid file type. Only MP3 files are allowed." },
        { status: 400 }
      );
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const { fileKey } = await uploadAudioFile(buffer, file.name);

    // Get audio duration (simplified - in production use audio metadata library)
    // For now, we'll estimate based on file size (rough estimate: 1MB ≈ 1 minute at 128kbps)
    const estimatedDuration = Math.round((file.size / 1024 / 1024) * 60);

    // Insert song record into database
    const { data: song, error } = await supabase
      .from("songs")
      .insert({
        title,
        artist,
        album: album || null,
        file_key: fileKey,
        cover_image_url: coverImageUrl || null,
        duration: estimatedDuration,
        genre,
        mood,
        bpm: bpm ? parseInt(bpm) : null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create song record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, song });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
