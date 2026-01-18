"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Play, Loader2, ArrowLeft, Music } from "lucide-react"
import { getPlaylistSongs } from "@/lib/api/playlists"
import { getSupabaseClient } from "@/lib/supabase/client"
import { usePlayerStore } from "@/store/player-store"
import type { Playlist } from "@/types/database"
import Link from "next/link"

const genreMap: Record<string, string> = {
  jazz: "ジャズ",
  pop: "ポップ",
  bossa: "ボサノバ",
  bossanova: "ボサノバ",
  classical: "クラシック",
  ambient: "アンビエント",
  lounge: "ラウンジ",
  acoustic: "アコースティック",
  electronic: "エレクトロニック",
}

export default function GenrePage() {
  const params = useParams()
  const slug = params.slug as string
  const genreName = genreMap[slug]

  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  
  const setPlaylist = usePlayerStore((state) => state.setPlaylist)

  // データ取得関数を useCallback で定義
  const fetchPlaylists = useCallback(async () => {
    if (!genreName) {
      setStatus("success")
      return
    }

    setStatus("loading")

    try {
      const supabase = getSupabaseClient()
      
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("is_public", true)
        .eq("primary_genre", slug)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching playlists:", error)
        setPlaylists([])
        setStatus("error")
        return
      }

      setPlaylists(data || [])
      setStatus("success")
    } catch (error) {
      console.error("Error fetching playlists:", error)
      setPlaylists([])
      setStatus("error")
    }
  }, [slug, genreName])

  // コンポーネントマウント時とslug変更時にデータを取得
  useEffect(() => {
    // ブラウザ環境でのみ実行
    if (typeof window !== "undefined") {
      fetchPlaylists()
    }
  }, [fetchPlaylists])

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

  if (!genreName) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <Music className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">ジャンルが見つかりません</h1>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            ホームに戻る
          </Button>
        </Link>
      </div>
    )
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ホームに戻る
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">{genreName}</h1>
        <p className="mt-2 text-muted-foreground">{genreName}ジャンルのプレイリスト</p>
      </div>

      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Music className="h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg text-muted-foreground">
            このジャンルにはまだプレイリストがありません
          </p>
          <Link href="/" className="mt-4">
            <Button variant="outline">ホームに戻る</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist) => (
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
                    onClick={() => toggleFavorite(playlist.id)}
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
