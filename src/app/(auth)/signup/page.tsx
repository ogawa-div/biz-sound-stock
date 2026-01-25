"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Music, Loader2, Mail, Lock, Eye, EyeOff, User, Store } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import type { BusinessType } from "@/types/database"

// Supabaseクライアントを直接作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const businessTypes: { value: BusinessType; label: string; icon: string }[] = [
  { value: "cafe", label: "カフェ", icon: "☕" },
  { value: "restaurant", label: "レストラン", icon: "🍽️" },
  { value: "salon", label: "美容室", icon: "💇" },
  { value: "retail", label: "アパレル", icon: "👕" },
  { value: "hotel", label: "ホテル", icon: "🏨" },
  { value: "gym", label: "ジム", icon: "💪" },
  { value: "spa", label: "スパ", icon: "🧖" },
  { value: "other", label: "その他", icon: "🏢" },
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: 基本情報, 2: 業種選択
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [businessType, setBusinessType] = useState<BusinessType>("cafe")
  const [businessName, setBusinessName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("パスワードが一致しません")
      return
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください")
      return
    }

    setStep(2)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            business_type: businessType,
            business_name: businessName,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("このメールアドレスは既に登録されています")
        } else {
          setError(signUpError.message)
        }
        return
      }

      // Update profile with business info (using fetch API)
      if (data.user) {
        const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${data.user.id}`,
          {
            method: "PATCH",
            headers: {
              "apikey": apiKey || "",
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "Prefer": "return=minimal",
            },
            body: JSON.stringify({
              display_name: displayName,
              business_type: businessType,
              business_name: businessName,
            }),
          }
        )
      }

      // Redirect to success page
      router.push("/signup/success")
    } catch {
      setError("登録に失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Music className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">BizSound Stock</h1>
          <p className="mt-2 text-muted-foreground">店舗向けBGMサービス</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 flex justify-center gap-2">
          <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-accent" : "bg-muted"}`} />
          <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-accent" : "bg-muted"}`} />
        </div>

        {/* Signup Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold text-foreground">
              {step === 1 ? "アカウント作成" : "店舗情報"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "メールアドレスとパスワードを入力してください"
                : "あなたの店舗について教えてください"}
            </p>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* Display Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    お名前
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="山田 太郎"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    メールアドレス
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="mail@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    パスワード
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-12 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="6文字以上"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    パスワード（確認）
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="もう一度入力"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent py-6 text-accent-foreground hover:bg-accent/90"
                >
                  次へ
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* Business Type */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">
                    業種を選択
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {businessTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setBusinessType(type.value)}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                          businessType === type.value
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border text-foreground hover:border-accent/50"
                        }`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    店舗名
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      placeholder="カフェ ビズミュージック"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 py-6"
                    onClick={() => setStep(1)}
                  >
                    戻る
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent py-6 text-accent-foreground hover:bg-accent/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        登録中...
                      </>
                    ) : (
                      "登録する"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              既にアカウントをお持ちですか？{" "}
              <Link href="/login" className="text-accent hover:underline">
                ログイン
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
