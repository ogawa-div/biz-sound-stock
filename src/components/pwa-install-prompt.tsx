"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches
    
    setIsIOS(isIOSDevice && !isInStandaloneMode)

    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-prompt-dismissed")
    if (dismissed) return

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // For iOS, show manual instructions after delay
    if (isIOSDevice && !isInStandaloneMode) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 duration-300 md:left-auto md:right-4 md:w-80">
      <div className="rounded-xl border border-border bg-card p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
            <Smartphone className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              アプリをインストール
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isIOS
                ? "ホーム画面に追加して、アプリのように使えます"
                : "ホーム画面に追加して、すぐにアクセス"}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="mt-4 rounded-lg bg-muted/50 p-3 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Safari</span>で
              <span className="mx-1 inline-flex items-center rounded bg-muted px-1">
                共有
              </span>
              →
              <span className="mx-1 inline-flex items-center rounded bg-muted px-1">
                ホーム画面に追加
              </span>
            </p>
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleDismiss}
            >
              後で
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleInstall}
            >
              <Download className="mr-1 h-4 w-4" />
              インストール
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
