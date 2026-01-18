"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Play, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { getPlaylistSongs } from "@/lib/api/playlists"
import { usePlayerStore } from "@/store/player-store"
import type { Playlist } from "@/types/database"
import Link from "next/link"

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(null)
  
  const setPlaylist = usePlayerStore((state) => state.setPlaylist)

  useEffect(() => {
    // タイムアウト: 5秒以上かかったらローディングを終了
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    async function fetchFavorites() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("user_favorites")
          .select(`
            playlist_id,
            playlists (*)
          `)
          .eq("user_id", user.id)
          .not("playlist_id", "is", null)

        if (error) {
          console.error("Error fetching favorites:", error)
          // エラーが発生しても空の状態を表示
          setFavorites([])
        } else {
          const playlists = (data
            ?.map((item: { playlists: unknown }) => item.playlists as unknown as Playlist)
            .filter((p: Playlist | null) => p !== null) || []) as Playlist[]
          
          setFavorites(playlists)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
        setFavorites([])
      } finally {
        setIsLoading(false)
      }
    }

    // authLoading が完了したら、または 2秒後に実行
    if (!authLoading) {
      fetchFavorites()
    } else {
      // authLoading が長すぎる場合のフォールバック
      const authTimeout = setTimeout(() => {
        fetchFavorites()
      }, 2000)
      return () => clearTimeout(authTimeout)
    }

    return () => clearTimeout(timeout)
  }, [user, authLoading])

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

  const removeFavorite = async (playlistId: string) => {
    if (!user) return

    try {
      const supabase = getSupabaseClient()
      await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("playlist_id", playlistId)

      setFavorites((prev) => prev.filter((p) => p.id !== playlistId))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  // isLoading のみでチェック（authLoading は内部で処理済み）
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <Heart className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">お気に入り</h1>
        <p className="text-muted-foreground">お気に入りを表示するにはログインが必要です</p>
        <Link href="/login">
          <Button>ログイン</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">お気に入り</h1>
        <p className="mt-2 text-muted-foreground">お気に入りに追加したプレイリスト</p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg text-muted-foreground">
            お気に入りのプレイリストがありません
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            ホームでプレイリストのハートアイコンをクリックして追加してください
          </p>
          <Link href="/" className="mt-4">
            <Button variant="outline">ホームに戻る</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((playlist) => (
            <Card key={playlist.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={playlist.cover_image_url || "/placeholder-album.jpg"}
                    alt={playlist.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <Button
                    size="icon"
                    onClick={() => handlePlayPlaylist(playlist)}
                    disabled={loadingPlaylistId === playlist.id}
                    className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all hover:scale-110 group-hover:opacity-100"
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
                    onClick={() => removeFavorite(playlist.id)}
                    className="absolute right-4 top-4 h-10 w-10 rounded-full bg-accent/90 text-accent-foreground hover:bg-accent"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{playlist.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {playlist.description || "プレイリストの説明"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
