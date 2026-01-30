"use client"

import { ReactNode, useEffect } from "react"

export default function LandingPageLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.setAttribute("data-lp-page", "true")
    body.setAttribute("data-lp-page", "true")

    // Enable scrolling (override globals.css fixed viewport)
    html.style.position = "static"
    html.style.overflow = "auto"
    body.style.position = "static"
    body.style.overflow = "auto"

    return () => {
      html.removeAttribute("data-lp-page")
      body.removeAttribute("data-lp-page")
      html.style.position = "fixed"
      html.style.overflow = "hidden"
      body.style.position = "fixed"
      body.style.overflow = "hidden"
    }
  }, [])

  return <>{children}</>
}
