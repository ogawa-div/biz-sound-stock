"use client"

import { useEffect } from "react"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Enable scrolling for this page
    const html = document.documentElement
    const body = document.body
    
    html.style.position = "static"
    html.style.overflow = "auto"
    body.style.position = "static"
    body.style.overflow = "auto"
    
    return () => {
      // Restore original styles when leaving
      html.style.position = "fixed"
      html.style.overflow = "hidden"
      body.style.position = "fixed"
      body.style.overflow = "hidden"
    }
  }, [])

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
