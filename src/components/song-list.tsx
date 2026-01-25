"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Play, Pause, Shuffle, Loader2, Music, Clock } from "lucide-react"
import { usePlayerStore } from "@/store/player-store"
import { useSongsStore } from "@/store/songs-store"
import { useAuth } from "@/lib/auth/context"
import { createBrowserClient } from "@supabase/ssr"
import type { Song } from "@/types/database"
import { cn } from "@/lib/utils"

// Format duration from seconds to mm:ss
function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Supabaseクライアント
function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function SongList() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loadingFavorite, setLoadingFavorite] = useState<string | null>(null)
  
  // グローバルストアから曲を取得
  const { songs, isLoading, fetchSongs } = useSongsStore()
  
  const { user } = useAuth()
  const { currentSong, isPlaying, playSong, toggle } = usePlayerStore()

  // コンポーネントマウント時に曲を取得
  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  // お気に入りを取得（ログインユーザーのみ）
  useEffect(() => {
    if (!user) {
      setFavorites(new Set())
      return
    }
    
    let isMounted = true
    const userId = user.id
    
    async function fetchFavorites() {
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase
          .from("user_favorites")
          .select("song_id")
          .eq("user_id", userId)
          .not("song_id", "is", null)

        if (!error && data && isMounted) {
          const favSet = new Set(
            data.map((f: { song_id: string | null }) => f.song_id).filter(Boolean) as string[]
          )
          setFavorites(favSet)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }

    fetchFavorites()
    
    return () => {
      isMounted = false
    }
  }, [user])

  const handlePlayAll = () => {
    if (songs.length === 0) return
    const shuffled = shuffleArray(songs)
    playSong(shuffled[0], undefined, shuffled)
  }

  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      toggle()
    } else {
      playSong(song, undefined, songs)
    }
  }

  const toggleFavorite = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return

    setLoadingFavorite(songId)
    try {
      const supabase = getSupabase()
      const isFavorite = favorites.has(songId)

      if (isFavorite) {
        await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("song_id", songId)
        
        setFavorites((prev) => {
          const next = new Set(prev)
          next.delete(songId)
          return next
        })
      } else {
        await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, song_id: songId })
        
        setFavorites((prev) => new Set(prev).add(songId))
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setLoadingFavorite(null)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8 flex items-center gap-6">
          <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-accent/50 to-primary/50">
            <Music className="h-20 w-20 text-foreground/60" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase text-muted-foreground">プレイリスト</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">すべての曲</h1>
            <div className="mt-4 h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-md p-3">
              <div className="h-12 w-12 animate-pulse rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/60 to-primary/60 shadow-xl">
          <Music className="h-20 w-20 text-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">プレイリスト</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">すべての曲</h1>
          <p className="mt-2 text-muted-foreground">
            BizSound Stock の全楽曲ライブラリ
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {songs.length} 曲
          </p>
        </div>
      </div>

      {/* Play All Button */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          size="lg"
          onClick={handlePlayAll}
          disabled={songs.length === 0}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Shuffle className="h-5 w-5" />
          シャッフル再生
        </Button>
      </div>

      {/* Song List */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Music className="h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg text-muted-foreground">
            楽曲がありません
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            楽曲はSupabaseダッシュボードから追加できます
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-border px-4 py-2 text-xs font-medium uppercase text-muted-foreground">
            <span className="w-8">#</span>
            <span>タイトル</span>
            <span className="hidden sm:block w-20 text-right">
              <Clock className="ml-auto h-4 w-4" />
            </span>
            <span className="w-10"></span>
          </div>

          {/* Song Rows */}
          {songs.map((song, index) => {
            const isCurrentSong = currentSong?.id === song.id
            const isPlayingThis = isCurrentSong && isPlaying

            return (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song)}
                className={cn(
                  "group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 rounded-md px-4 py-2 cursor-pointer transition-colors",
                  isCurrentSong
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-secondary/50"
                )}
              >
                {/* Number / Play Icon */}
                <div className="flex w-8 items-center justify-center">
                  <span className={cn(
                    "text-sm tabular-nums",
                    isCurrentSong ? "text-accent" : "text-muted-foreground group-hover:hidden"
                  )}>
                    {isPlayingThis ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <span className="group-hover:hidden">{index + 1}</span>
                    )}
                  </span>
                  {!isCurrentSong && (
                    <Play className="hidden h-4 w-4 group-hover:block" />
                  )}
                </div>

                {/* Song Info */}
                <div className="min-w-0">
                  <p className={cn(
                    "truncate font-medium",
                    isCurrentSong ? "text-accent" : "text-foreground"
                  )}>
                    {song.title}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {song.artist}
                  </p>
                </div>

                {/* Duration */}
                <span className="hidden sm:block w-20 text-right text-sm tabular-nums text-muted-foreground">
                  {formatDuration(song.duration)}
                </span>

                {/* Favorite Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => toggleFavorite(song.id, e)}
                  disabled={!user || loadingFavorite === song.id}
                  className={cn(
                    "h-8 w-8",
                    favorites.has(song.id)
                      ? "text-accent"
                      : "text-muted-foreground opacity-0 group-hover:opacity-100"
                  )}
                >
                  {loadingFavorite === song.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={cn("h-4 w-4", favorites.has(song.id) && "fill-current")} />
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
