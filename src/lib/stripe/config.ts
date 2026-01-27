import Stripe from "stripe"

// Server-side Stripe instance
// This file should only be imported in server components or API routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
})

// Price IDs from Stripe Dashboard
export const STRIPE_PRICES = {
  // 有料プラン
  STANDARD: process.env.STRIPE_PRICE_STANDARD!,
  EARLY_BIRD: process.env.STRIPE_PRICE_EARLY_BIRD!,
  // 後方互換性のため残す（削除予定）
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
  PREMIUM_YEARLY: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
} as const
