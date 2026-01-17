"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Play, Sparkles, Loader2 } from "lucide-react"
import { getNewReleases, getFeaturedPlaylists, getPlaylistSongs } from "@/lib/api/playlists"
import { usePlayerStore } from "@/store/player-store"
import type { Playlist } from "@/types/database"

// Format duration from seconds to human readable
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}時間${minutes}分`
  }
  return `${minutes}分`
}

// Placeholder images for demo (replace with actual images from DB)
const placeholderImages = [
  "/cozy-cafe-morning-atmosphere.jpg",
  "/bright-lunch-restaurant.jpg",
  "/modern-beauty-salon.png",
  "/relaxing-lounge-ambient.jpg",
  "/modern-jazz-stylish.jpg",
  "/beauty-salon-chill-music.jpg",
]

function getPlaceholderImage(index: number): string {
  return placeholderImages[index % placeholderImages.length]
}

export function PlaylistGrid() {
  const [newReleases, setNewReleases] = useState<Playlist[]>([])
  const [featuredPlaylists, setFeaturedPlaylists] = useState<Playlist[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(null)
  
  const setPlaylist = usePlayerStore((state) => state.setPlaylist)

  // Fetch playlists on mount
  useEffect(() => {
    async function fetchPlaylists() {
      console.log('[PlaylistGrid] Starting to fetch playlists...')
      try {
        setIsLoading(true)
        const [newReleasesData, featuredData] = await Promise.all([
          getNewReleases(3),
          getFeaturedPlaylists(),
        ])
        console.log('[PlaylistGrid] New Releases:', newReleasesData)
        console.log('[PlaylistGrid] Featured:', featuredData)
        setNewReleases(newReleasesData)
        setFeaturedPlaylists(featuredData)
      } catch (error) {
        console.error("[PlaylistGrid] Error fetching playlists:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPlaylists()
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handlePlayPlaylist = async (playlist: Playlist) => {
    try {
      setLoadingPlaylistId(playlist.id)
      const songs = await getPlaylistSongs(playlist.id)
      if (songs.length > 0) {
        setPlaylist(playlist, songs)
      }
    } catch (error) {
      console.error("Error loading playlist:", error)
    } finally {
      setLoadingPlaylistId(null)
    }
  }

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-accent" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">ニューリリース</h2>
              <p className="mt-1 text-sm text-muted-foreground">最近追加・更新されたプレイリスト</p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-2 border-accent/20">
                <CardContent className="p-0">
                  <div className="aspect-square animate-pulse bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {newReleases.length > 0 && (
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-accent" />
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">ニューリリース</h2>
              <p className="mt-1 text-sm text-muted-foreground">最近追加・更新されたプレイリスト</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newReleases.map((playlist, index) => (
              <Card
                key={playlist.id}
                className="group relative overflow-hidden border-2 border-accent/50 transition-all hover:border-accent hover:shadow-xl hover:shadow-accent/10"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-lg">
                      <Sparkles className="h-3 w-3" />
                      NEW
                    </div>
                    <img
                      src={playlist.cover_image_url || getPlaceholderImage(index)}
                      alt={playlist.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    <Button
                      size="icon"
                      onClick={() => handlePlayPlaylist(playlist)}
                      disabled={loadingPlaylistId === playlist.id}
                      className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all hover:scale-110 hover:bg-accent group-hover:opacity-100 disabled:opacity-100"
                    >
                      {loadingPlaylistId === playlist.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Play className="h-5 w-5 fill-current" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(playlist.id)
                      }}
                      className={`absolute right-4 top-4 h-10 w-10 rounded-full transition-colors ${
                        favorites.has(playlist.id)
                          ? "bg-accent/90 text-accent-foreground hover:bg-accent"
                          : "bg-black/40 text-white hover:bg-black/60"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${favorites.has(playlist.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground">{playlist.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {playlist.description || "プレイリストの説明"}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{playlist.track_count}曲</span>
                      <span>•</span>
                      <span>{formatDuration(playlist.total_duration)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">おすすめプレイリスト</h2>
        <p className="mt-2 text-muted-foreground">あなたの店舗に最適なBGMをお選びください</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featuredPlaylists.map((playlist, index) => (
          <Card key={playlist.id} className="group overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={playlist.cover_image_url || getPlaceholderImage(index + 3)}
                  alt={playlist.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <Button
                  size="icon"
                  onClick={() => handlePlayPlaylist(playlist)}
                  disabled={loadingPlaylistId === playlist.id}
                  className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all hover:scale-110 hover:bg-accent group-hover:opacity-100 disabled:opacity-100"
                >
                  {loadingPlaylistId === playlist.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5 fill-current" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(playlist.id)
                  }}
                  className={`absolute right-4 top-4 h-10 w-10 rounded-full transition-colors ${
                    favorites.has(playlist.id)
                      ? "bg-accent/90 text-accent-foreground hover:bg-accent"
                      : "bg-black/40 text-white hover:bg-black/60"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favorites.has(playlist.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{playlist.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {playlist.description || "プレイリストの説明"}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{playlist.track_count}曲</span>
                  <span>•</span>
                  <span>{formatDuration(playlist.total_duration)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty state for featured playlists */}
        {featuredPlaylists.length === 0 && !isLoading && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <p>おすすめプレイリストがありません</p>
            <p className="mt-1 text-sm">管理者がプレイリストを公開すると表示されます</p>
          </div>
        )}
      </div>
    </div>
  )
}
