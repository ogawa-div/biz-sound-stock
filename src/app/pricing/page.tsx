"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  Check, 
  Loader2, 
  Music, 
  Sparkles, 
  Crown,
  ArrowLeft,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { PLANS } from "@/lib/stripe/plans"

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCanceled, setShowCanceled] = useState(false)

  // Check URL params for success/canceled
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true)
    }
    if (searchParams.get("canceled") === "true") {
      setShowCanceled(true)
    }
  }, [searchParams])

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/login?redirect=/pricing")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          priceType: "monthly",
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("No checkout URL returned")
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Portal error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isPremium = profile?.subscription_status === "active" || 
                    profile?.subscription_status === "trialing"

  // Success message
  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-green-500/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              サブスクリプション登録完了！
            </h1>
            <p className="mb-6 text-muted-foreground">
              14日間の無料トライアルが始まりました。
              <br />
              すべての機能をお楽しみください！
            </p>
            <Link href="/">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                音楽を聴き始める
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Canceled message
  if (showCanceled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <XCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              キャンセルされました
            </h1>
            <p className="mb-6 text-muted-foreground">
              ご検討いただきありがとうございます。
              <br />
              いつでもプレミアムプランにアップグレードできます。
            </p>
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  ホームに戻る
                </Button>
              </Link>
              <Button 
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setShowCanceled(false)}
              >
                プランを見る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Music className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">BizSound Stock</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
            <Sparkles className="h-4 w-4" />
            14日間無料トライアル
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            あなたの店舗に最適な
            <br />
            <span className="text-accent">BGMプラン</span>を選ぶ
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            著作権フリーの高品質BGMで、店舗の雰囲気を演出。
            <br />
            JASRACへの申請不要で、すぐに利用開始できます。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="relative border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold text-foreground">
                {PLANS.free.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {PLANS.free.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">¥0</span>
                <span className="text-muted-foreground">/月</span>
              </div>

              <ul className="mb-8 space-y-3">
                {PLANS.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant="outline" 
                className="w-full"
                disabled={!isPremium && !!user}
              >
                {!user ? "現在のプラン" : isPremium ? "ダウングレード" : "現在のプラン"}
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-accent bg-gradient-to-b from-accent/5 to-transparent">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-foreground">
                <Crown className="h-3 w-3" />
                おすすめ
              </div>
            </div>
            <CardHeader className="pb-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                {PLANS.premium.name}
                <Sparkles className="h-5 w-5 text-accent" />
              </h3>
              <p className="text-sm text-muted-foreground">
                {PLANS.premium.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  ¥{PLANS.premium.price.toLocaleString()}
                </span>
                <span className="text-muted-foreground">/月</span>
              </div>

              <ul className="mb-8 space-y-3">
                {PLANS.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {authLoading ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </Button>
              ) : isPremium ? (
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "サブスクリプション管理"
                  )}
                </Button>
              ) : (
                <Button 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    "14日間無料で始める"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ or Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            ✓ いつでもキャンセル可能 &nbsp;&nbsp; ✓ 隠れた費用なし &nbsp;&nbsp; ✓ 14日間無料
          </p>
        </div>
      </main>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
