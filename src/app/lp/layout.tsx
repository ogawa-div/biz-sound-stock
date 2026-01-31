import { ReactNode } from "react"

export default function LandingPageLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>
}
