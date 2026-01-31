"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 固定レイアウトを有効化
  useEffect(() => {
    document.documentElement.setAttribute("data-layout", "fixed")
    return () => {
      document.documentElement.removeAttribute("data-layout")
    }
  }, [])

  return (
    <div className="flex h-safe-screen flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main 
          className="flex-1 overflow-y-auto overscroll-none md:pt-0"
          style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}
        >
          {children}
        </main>
      </div>
      <MusicPlayer />
    </div>
  )
}
