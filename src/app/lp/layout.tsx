"use client"

import { ReactNode, useEffect } from "react"

export default function LandingPageLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.setAttribute("data-lp-page", "true")
    body.setAttribute("data-lp-page", "true")

    // Enable scrolling with !important to override globals.css
    html.style.setProperty("position", "static", "important")
    html.style.setProperty("overflow", "auto", "important")
    html.style.setProperty("height", "auto", "important")
    body.style.setProperty("position", "static", "important")
    body.style.setProperty("overflow", "auto", "important")
    body.style.setProperty("height", "auto", "important")

    return () => {
      html.removeAttribute("data-lp-page")
      body.removeAttribute("data-lp-page")
      html.style.removeProperty("position")
      html.style.removeProperty("overflow")
      html.style.removeProperty("height")
      body.style.removeProperty("position")
      body.style.removeProperty("overflow")
      body.style.removeProperty("height")
    }
  }, [])

  return <>{children}</>
}
