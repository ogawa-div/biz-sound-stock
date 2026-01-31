"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, Crown, Sparkles } from "lucide-react"
import { usePlayer } from "@/context/PlayerContext"

export function UpgradePrompt() {
  const { showUpgradePrompt, dismissUpgradePrompt, next } = usePlayer()

  if (!showUpgradePrompt) return null

  const handleSkip = () => {
    dismissUpgradePrompt()
    next()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="rounded-2xl border border-accent/30 bg-card p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <Crown className="h-8 w-8 text-accent" />
          </div>

          {/* Title */}
          <h2 className="mb-2 text-center text-xl font-bold text-foreground">
            プレビュー終了
          </h2>
          <p className="mb-6 text-center text-muted-foreground">
            無料プランでは30秒のプレビューのみ再生可能です。
            <br />
            フル再生するには有料プランにアップグレードしてください。
          </p>

          {/* Features */}
          <div className="mb-6 rounded-lg bg-muted/30 p-4">
            <p className="mb-2 text-sm font-medium text-foreground">
              Premiumで利用可能:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-accent" />
                無制限の音楽再生
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-accent" />
                すべてのプレイリストにアクセス
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-accent" />
                高音質ストリーミング
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleSkip}
            >
              次の曲へ
            </Button>
            <Link href="/pricing" className="flex-1">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Crown className="mr-2 h-4 w-4" />
                アップグレード
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
