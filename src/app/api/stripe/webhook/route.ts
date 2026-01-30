import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/config"
import { createClient } from "@supabase/supabase-js"
import Stripe from "stripe"

// Force Node.js runtime (required for Stripe webhook signature verification)
export const runtime = "nodejs"

// Create Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id
  if (!userId) return

  console.log("[Webhook] checkout.session.completed for user:", userId)

  // Get the subscription to check its actual status (active or trialing)
  let subscriptionStatus = "active"
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    subscriptionStatus = subscription.status === "trialing" ? "trialing" : "active"
    console.log("[Webhook] Subscription status:", subscriptionStatus)
  }

  const { error } = await supabaseAdmin.from("profiles").update({
    subscription_status: subscriptionStatus,
    subscription_plan: "premium",
  }).eq("id", userId)

  if (error) {
    console.error("[Webhook] Failed to update profile:", error)
  } else {
    console.log("[Webhook] Profile updated successfully for user:", userId)
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  console.log("[Webhook] subscription change for customer:", customerId, "status:", subscription.status)
  
  // Try to get user by customer ID first
  let { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  // Fallback: try to get user from subscription metadata
  if (!profile && subscription.metadata?.supabase_user_id) {
    const userId = subscription.metadata.supabase_user_id
    console.log("[Webhook] Using metadata fallback, user_id:", userId)
    const { data: profileByMeta } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single()
    profile = profileByMeta
  }

  if (!profile) {
    console.error("[Webhook] Profile not found for customer:", customerId)
    return
  }

  // Map Stripe status to our status
  let status: string
  switch (subscription.status) {
    case "active":
      status = "active"
      break
    case "trialing":
      status = "trialing"
      break
    case "past_due":
      status = "past_due"
      break
    case "canceled":
    case "unpaid":
      status = "canceled"
      break
    default:
      status = subscription.status
  }

  const { error } = await supabaseAdmin.from("profiles").update({
    subscription_status: status,
    subscription_plan: status === "canceled" ? "free" : "premium",
    trial_ends_at: subscription.trial_end 
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  }).eq("id", profile.id)

  if (error) {
    console.error("[Webhook] Failed to update subscription status:", error)
  } else {
    console.log("[Webhook] Subscription status updated to:", status, "for user:", profile.id)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!profile) return

  await supabaseAdmin.from("profiles").update({
    subscription_status: "canceled",
    subscription_plan: "free",
  }).eq("id", profile.id)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single()

  if (!profile) return

  await supabaseAdmin.from("profiles").update({
    subscription_status: "past_due",
  }).eq("id", profile.id)
}
