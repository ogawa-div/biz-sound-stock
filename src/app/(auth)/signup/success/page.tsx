"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Music, CheckCircle, Mail } from "lucide-react"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Music className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-8 pb-8">
            {/* Success Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-foreground">
              登録完了！
            </h1>
            <p className="mb-6 text-muted-foreground">
              BizSound Stockへようこそ！
            </p>

            {/* Email Verification Notice */}
            <div className="mb-6 rounded-lg bg-accent/10 p-4">
              <div className="flex items-center justify-center gap-2 text-accent">
                <Mail className="h-5 w-5" />
                <span className="font-medium">確認メールを送信しました</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                メール内のリンクをクリックして、アカウントを有効化してください。
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full bg-accent py-6 text-accent-foreground hover:bg-accent/90">
                ログインページへ
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="mt-6 text-sm text-muted-foreground">
          メールが届かない場合は、迷惑メールフォルダをご確認ください。
        </p>
      </div>
    </div>
  )
}
