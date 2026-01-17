"use client"

import { WifiOff, RefreshCw, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      {/* Logo */}
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <Music className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">BizSound Stock</h1>
      </div>

      {/* Offline Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-12 w-12 text-muted-foreground" />
      </div>

      {/* Message */}
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        オフラインです
      </h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        インターネット接続が見つかりません。
        <br />
        接続を確認して、もう一度お試しください。
      </p>

      {/* Retry Button */}
      <Button
        onClick={handleRetry}
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        再接続を試す
      </Button>

      {/* Tips */}
      <div className="mt-12 rounded-lg bg-card/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">💡 ヒント</p>
        <ul className="mt-2 list-inside list-disc text-left">
          <li>Wi-Fiまたはモバイルデータをオンにする</li>
          <li>機内モードがオフになっているか確認</li>
          <li>ルーターを再起動する</li>
        </ul>
      </div>
    </div>
  )
}
