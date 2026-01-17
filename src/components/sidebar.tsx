"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Home, Heart, Music, Coffee, Scissors, UtensilsCrossed, 
  Shirt, Hotel, Store, LogIn, LogOut, Settings, User, Menu, X 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { Button } from "@/components/ui/button"

type Category = {
  id: string
  name: string
  icon: React.ElementType
  type: "main" | "business" | "genre"
  href?: string
}

const categories: Category[] = [
  { id: "home", name: "ホーム", icon: Home, type: "main", href: "/" },
  { id: "favorites", name: "お気に入り", icon: Heart, type: "main", href: "/favorites" },
  { id: "cafe", name: "カフェ", icon: Coffee, type: "business", href: "/category/cafe" },
  { id: "salon", name: "美容室", icon: Scissors, type: "business", href: "/category/salon" },
  { id: "restaurant", name: "レストラン", icon: UtensilsCrossed, type: "business", href: "/category/restaurant" },
  { id: "apparel", name: "アパレル", icon: Shirt, type: "business", href: "/category/apparel" },
  { id: "hotel", name: "ホテル", icon: Hotel, type: "business", href: "/category/hotel" },
  { id: "retail", name: "小売店", icon: Store, type: "business", href: "/category/retail" },
]

const genres = [
  { id: "jazz", name: "ジャズ", href: "/genre/jazz" },
  { id: "pop", name: "ポップ", href: "/genre/pop" },
  { id: "bossanova", name: "ボサノバ", href: "/genre/bossanova" },
  { id: "classical", name: "クラシック", href: "/genre/classical" },
  { id: "ambient", name: "アンビエント", href: "/genre/ambient" },
  { id: "lounge", name: "ラウンジ", href: "/genre/lounge" },
]

// Sidebar content component (shared between desktop and mobile)
function SidebarContent({ 
  activeCategory, 
  setActiveCategory, 
  onCategoryClick,
  onClose 
}: { 
  activeCategory: string
  setActiveCategory: (id: string) => void
  onCategoryClick: (category: Category) => void
  onClose?: () => void
}) {
  const router = useRouter()
  const { user, profile, isLoading, isAdmin, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    onClose?.()
    router.push("/login")
  }

  const handleCategoryClick = (category: Category) => {
    onCategoryClick(category)
    onClose?.()
  }

  const handleGenreClick = (genre: { id: string; name: string; href: string }) => {
    setActiveCategory(genre.id)
    router.push(genre.href)
    onClose?.()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">BizSound Stock</h1>
            <p className="mt-1 text-sm text-muted-foreground">店舗向けBGMサービス</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="rounded-md p-2 hover:bg-secondary md:hidden">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              メニュー
            </h2>
            <div className="space-y-1">
              {categories
                .filter((c) => c.type === "main")
                .map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        activeCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {category.name}
                    </button>
                  )
                })}
            </div>
          </div>

          <div>
            <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              業種別プレイリスト
            </h2>
            <div className="space-y-1">
              {categories
                .filter((c) => c.type === "business")
                .map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        activeCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {category.name}
                    </button>
                  )
                })}
            </div>
          </div>

          <div>
            <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              音楽ジャンル
            </h2>
            <div className="space-y-1">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    activeCategory === genre.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary",
                  )}
                >
                  <Music className="h-5 w-5" />
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Link */}
          {isAdmin && (
            <div>
              <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                管理
              </h2>
              <div className="space-y-1">
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-accent hover:bg-secondary transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  管理者ダッシュボード
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4">
        {isLoading ? (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <div className="flex-1">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ) : user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.display_name || user.email?.split("@")[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.business_name || user.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
        ) : (
          <Link href="/login" onClick={onClose}>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <LogIn className="mr-2 h-4 w-4" />
              ログイン
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

// Mobile header with hamburger menu
export function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
      <button onClick={onMenuClick} className="rounded-md p-2 hover:bg-secondary">
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-bold text-foreground">BizSound Stock</h1>
      <div className="w-9" /> {/* Spacer for centering */}
    </header>
  )
}

// Mobile drawer overlay
function MobileDrawer({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode 
}) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <aside className="absolute left-0 top-0 h-full w-72 animate-in slide-in-from-left duration-300 bg-card shadow-xl">
        {children}
      </aside>
    </div>
  )
}

// Main Sidebar component with responsive behavior
export function Sidebar() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("home")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category.id)
    if (category.href) {
      router.push(category.href)
    }
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  const openMobileMenu = () => setIsMobileMenuOpen(true)

  return (
    <>
      {/* Mobile header */}
      <MobileHeader onMenuClick={openMobileMenu} />
      
      {/* Mobile drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
        <SidebarContent 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onCategoryClick={handleCategoryClick}
          onClose={closeMobileMenu}
        />
      </MobileDrawer>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 border-r border-border bg-card md:block">
        <SidebarContent 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onCategoryClick={handleCategoryClick}
        />
      </aside>
    </>
  )
}
