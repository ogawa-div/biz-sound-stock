import Stripe from "stripe"

// Server-side Stripe instance
// This file should only be imported in server components or API routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
})

// Price IDs from Stripe Dashboard (Vercel環境変数に合わせた変数名)
export const STRIPE_PRICES = {
  // 有料プラン（本番用）
  STANDARD: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,                    // Standard Plan (¥980/月)
  EARLY_BIRD: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_EARLY_BIRD!,        // Early Bird Plan (¥500/月)
} as const
