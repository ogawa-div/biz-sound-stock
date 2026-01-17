import Stripe from "stripe"

// Server-side Stripe instance
// This file should only be imported in server components or API routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

// Price IDs from Stripe Dashboard
export const STRIPE_PRICES = {
  // 月額プラン
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
  // 年額プラン（オプション）
  PREMIUM_YEARLY: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
} as const
