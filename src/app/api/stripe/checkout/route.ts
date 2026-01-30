import { NextRequest, NextResponse } from "next/server"
import { stripe, STRIPE_PRICES } from "@/lib/stripe/config"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

// Create Supabase admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper function to create a new Stripe customer and save to DB
async function createAndSaveCustomer(userId: string, email: string): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: userId,
    },
  })
  
  await supabaseAdmin
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId)
  
  console.log(`[Checkout] Created new customer ${customer.id} for user ${userId}`)
  return customer.id
}

// Helper function to create checkout session
async function createCheckoutSession(
  customerId: string,
  priceId: string,
  baseUrl: string,
  userId: string
) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    payment_method_collection: "always", // トライアル時も支払い方法を必須で収集（期間終了後の自動課金を保証）
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/pricing?success=true`,
    cancel_url: `${baseUrl}/pricing?canceled=true`,
    subscription_data: {
      trial_period_days: 14, // 14日間の無料トライアル
      metadata: {
        supabase_user_id: userId,
      },
    },
    metadata: {
      supabase_user_id: userId,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, planId } = await request.json()

    if (!userId || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      )
    }

    if (!planId || (planId !== "standard" && planId !== "earlyBird")) {
      return NextResponse.json(
        { error: "Valid planId (standard or earlyBird) is required" },
        { status: 400 }
      )
    }

    // Get existing Stripe customer ID from profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    let customerId = profile?.stripe_customer_id

    // If no customer ID exists, create a new one
    if (!customerId) {
      customerId = await createAndSaveCustomer(userId, email)
    }

    // Determine price ID based on planId
    const priceId = planId === "standard" 
      ? STRIPE_PRICES.STANDARD 
      : STRIPE_PRICES.EARLY_BIRD

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 500 }
      )
    }

    // Base URL determination with fallback
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    // Try to create checkout session
    try {
      const session = await createCheckoutSession(customerId, priceId, baseUrl, userId)
      return NextResponse.json({ url: session.url })
    } catch (checkoutError) {
      // Check if this is a "resource_missing" error (invalid customer ID)
      if (
        checkoutError instanceof Stripe.errors.StripeInvalidRequestError &&
        checkoutError.code === "resource_missing"
      ) {
        console.log(`[Checkout] Customer ${customerId} not found in Stripe. Creating new customer...`)
        
        // Create a new customer and update the database
        customerId = await createAndSaveCustomer(userId, email)
        
        // Retry checkout session creation with the new customer ID
        const session = await createCheckoutSession(customerId, priceId, baseUrl, userId)
        return NextResponse.json({ url: session.url })
      }
      
      // Re-throw other errors
      throw checkoutError
    }
  } catch (error) {
    console.error("Stripe checkout error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to create checkout session", details: errorMessage },
      { status: 500 }
    )
  }
}
