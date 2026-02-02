"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

export default function LoginPage() {
  // SupabaseクライアントをuseRefで保持（再レンダリング時に再作成を防ぐ）
  const supabaseRef = useRef(
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // フォームから直接値を取得（より確実）
    const formData = new FormData(e.currentTarget)
    const emailValue = formData.get("email") as string || email
    const passwordValue = formData.get("password") as string || password

    console.log("[Login] Starting login for:", emailValue)

    try {
      const { data, error: authError } = await supabaseRef.current.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      })

      console.log("[Login] Response:", { data, error: authError })

      if (authError) {
        console.error("[Login] Auth error:", authError)
        if (authError.message.includes("Invalid login credentials")) {
          setError("メールアドレスまたはパスワードが正しくありません")
        } else {
          setError(authError.message)
        }
        setIsLoading(false)
        return
      }

      console.log("[Login] Success, redirecting...")
      // ログイン成功後、ページをリロードしてAuthContextを更新
      window.location.href = "/"
    } catch (err) {
      console.error("[Login] Unexpected error:", err)
      setError("ログインに失敗しました。もう一度お試しください。")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-safe-screen items-center justify-center bg-background p-4 pt-safe pb-safe">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl overflow-hidden">
            <img src="/icons/icon.svg" alt="BizSound Stock" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">BizSound Stock</h1>
          <p className="mt-2 text-muted-foreground">店舗向けBGMサービス</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold text-foreground">ログイン</h2>
            <p className="text-sm text-muted-foreground">
              アカウントにログインしてください
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="mail@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    inputMode="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-12 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10 touch-manipulation"
                    aria-label={showPassword ? "パスワードを非表示" : "パスワードを表示"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-accent hover:underline"
                >
                  パスワードをお忘れですか？
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-accent py-6 text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ログイン中...
                  </>
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              アカウントをお持ちでないですか？{" "}
              <Link href="/signup" className="text-accent hover:underline">
                新規登録
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          ログインすることで、
          <Link href="/terms" className="text-accent hover:underline">
            利用規約
          </Link>
          、
          <Link href="/privacy" className="text-accent hover:underline">
            プライバシーポリシー
          </Link>
          、
          <Link href="/legal/tokusho" className="text-accent hover:underline">
            特定商取引法に基づく表記
          </Link>
          に同意したことになります。
        </p>
      </div>
    </div>
  )
}
