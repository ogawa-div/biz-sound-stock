"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  CreditCard, 
  LogOut, 
  Loader2,
  Music,
  User,
  Crown
} from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const router = useRouter()
  const { user, profile, isLoading: authLoading } = useAuth()
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleManageSubscription = async () => {
    if (!user) return

    setIsLoadingPortal(true)
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        console.error("Portal error:", data.error, data.details)
        alert(`エラー: ${data.details || data.error}`)
      }
    } catch (error) {
      console.error("Portal error:", error)
    } finally {
      setIsLoadingPortal(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Subscription status display
  const getSubscriptionStatusDisplay = () => {
    const status = profile?.subscription_status
    if (status === "active") {
      return { text: "有効", color: "text-green-500", badge: "bg-green-500/10" }
    }
    if (status === "trialing") {
      return { text: "トライアル中", color: "text-amber-500", badge: "bg-amber-500/10" }
    }
    if (status === "past_due") {
      return { text: "支払い遅延", color: "text-red-500", badge: "bg-red-500/10" }
    }
    return { text: "未登録", color: "text-muted-foreground", badge: "bg-muted" }
  }

  const subscriptionStatus = getSubscriptionStatusDisplay()
  const isPremium = profile?.subscription_status === "active" || profile?.subscription_status === "trialing"

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
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
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">設定</h1>

        {/* Account Info Section */}
        <Card className="mb-6 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              アカウント情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">メールアドレス</p>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Section */}
        <Card className="mb-6 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5" />
              サブスクリプション管理
            </CardTitle>
            <CardDescription>
              契約内容の確認、プラン変更、解約はこちらから
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Status */}
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm text-muted-foreground">現在のステータス</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${subscriptionStatus.badge} ${subscriptionStatus.color}`}>
                    {subscriptionStatus.text}
                  </span>
                  {isPremium && (
                    <span className="text-sm text-foreground">Premium</span>
                  )}
                </div>
              </div>
              {!isPremium && (
                <Link href="/pricing">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    プランを見る
                  </Button>
                </Link>
              )}
            </div>

            {/* Manage Button */}
            {isPremium && (
              <Button 
                onClick={handleManageSubscription}
                disabled={isLoadingPortal}
                className="w-full"
                variant="outline"
              >
                {isLoadingPortal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    読み込み中...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    契約内容の確認・変更
                  </>
                )}
              </Button>
            )}

            <p className="text-xs text-muted-foreground">
              ※ Stripeの管理画面で、プラン変更・カード情報の更新・解約が行えます
            </p>
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LogOut className="h-5 w-5" />
              ログアウト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="destructive"
              className="w-full"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログアウト中...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
