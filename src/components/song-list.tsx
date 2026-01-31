"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Play, Pause, Loader2, Music, Sparkles } from "lucide-react"
import { usePlayerStore } from "@/store/player-store"
import { useSongsStore } from "@/store/songs-store"
import { useAuth } from "@/lib/auth/context"
import type { Song } from "@/types/database"
import { cn } from "@/lib/utils"

// Day info type for Daily Mix
type DayInfo = {
  title: string
  sub: string
}

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

// 直接fetch APIを使用（アクセストークンで認証）
async function fetchFavoritesFromSupabase(userId: string, accessToken: string): Promise<string[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_favorites?select=song_id&user_id=eq.${userId}&song_id=not.is.null`;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(url, {
    headers: {
      "apikey": apiKey || "",
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data.map((f: { song_id: string }) => f.song_id);
}

async function addFavorite(userId: string, songId: string, accessToken: string): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_favorites`;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": apiKey || "",
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ user_id: userId, song_id: songId }),
  });

  return response.ok;
}

async function removeFavorite(userId: string, songId: string, accessToken: string): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_favorites?user_id=eq.${userId}&song_id=eq.${songId}`;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "apikey": apiKey || "",
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  return response.ok;
}

export function SongList() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loadingFavorite, setLoadingFavorite] = useState<string | null>(null)
  const [dayInfo, setDayInfo] = useState<DayInfo | null>(null)
  
  // グローバルストアから曲を取得
  const { songs, isLoading, fetchSongs } = useSongsStore()
  
  const { user, session } = useAuth()
  const { currentSong, isPlaying, playSong, toggle } = usePlayerStore()

  // コンポーネントマウント時に曲を取得
  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  // クライアント側でのみ曜日情報を設定（ハイドレーションエラー回避）
  useEffect(() => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const currentDay = days[new Date().getDay()]
    
    setDayInfo({
      title: `${currentDay} Mix`,
      sub: `Optimized for ${currentDay}'s atmosphere`
    })
  }, [])


  // お気に入りを取得（ログインユーザーのみ）
  useEffect(() => {
    if (!user || !session?.access_token) {
      setFavorites(new Set())
      return
    }
    
    fetchFavoritesFromSupabase(user.id, session.access_token)
      .then((favIds) => setFavorites(new Set(favIds)))
      .catch((err) => console.error("Error fetching favorites:", err))
  }, [user, session])

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

  const toggleFavorite = async (songId: string) => {
    if (!user || !session?.access_token) return

    setLoadingFavorite(songId)
    try {
      const isFavorite = favorites.has(songId)

      if (isFavorite) {
        const success = await removeFavorite(user.id, songId, session.access_token)
        if (success) {
          setFavorites((prev) => {
            const next = new Set(prev)
            next.delete(songId)
            return next
          })
        }
      } else {
        const success = await addFavorite(user.id, songId, session.access_token)
        if (success) {
          setFavorites((prev) => new Set(prev).add(songId))
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setLoadingFavorite(null)
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 md:p-8">
        <div className="mb-8 flex items-center gap-6">
          <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-accent/50 to-primary/50">
            <Music className="h-20 w-20 text-foreground/60" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">STATION</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">BizSound Radio</h1>
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
    <div className="px-4 py-6 md:p-8">
      {/* Header + Daily Mix Button Container */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Left: Album Art + Text Info */}
        <div className="flex items-center gap-6">
          <div className="flex h-32 w-32 md:h-48 md:w-48 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/60 to-primary/60 shadow-xl">
            <Music className="h-14 w-14 md:h-20 md:w-20 text-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">STATION</p>
            <h1 className="mt-2 text-2xl md:text-4xl font-bold tracking-tight">BizSound Radio</h1>
            <p className="mt-2 text-muted-foreground">
              24/7 Store Music Stream
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {songs.length} tracks
            </p>
            {/* PC版のみ表示: Daily Mix バッジ */}
            <div className="hidden md:flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                {dayInfo ? dayInfo.title : "Daily Mix"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Daily Mix Button */}
        {/* スマホ版: カプセル型ボタン（テキスト付き） */}
        <button
          onClick={handlePlayAll}
          disabled={songs.length === 0}
          className="md:hidden group flex items-center gap-4 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 p-4 transition-all duration-300 hover:from-accent/30 hover:to-primary/30 hover:shadow-lg hover:shadow-accent/10 disabled:opacity-50 disabled:cursor-not-allowed w-full"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Play className="h-6 w-6 ml-0.5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-foreground">
                {dayInfo ? dayInfo.title : "Daily Mix"}
              </span>
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">
              {dayInfo ? dayInfo.sub : "Curated for store atmosphere"}
            </p>
          </div>
        </button>

        {/* PC版: 丸い再生ボタン */}
        <button
          onClick={handlePlayAll}
          disabled={songs.length === 0}
          className="hidden md:flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-xl hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          title={dayInfo ? dayInfo.title : "Daily Mix"}
        >
          <Play className="h-7 w-7 ml-0.5" />
        </button>
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
          {/* Song Rows */}
          {songs.map((song) => {
            const isCurrentSong = currentSong?.id === song.id
            const isPlayingThis = isCurrentSong && isPlaying

            return (
              <div
                key={song.id}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200",
                  isCurrentSong
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-white/5"
                )}
              >
                {/* Play/Pause Button */}
                <button
                  type="button"
                  onClick={() => handlePlaySong(song)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 cursor-pointer active:scale-95"
                >
                  {isPlayingThis ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </button>

                {/* Song Info - クリックで再生 */}
                <button
                  type="button"
                  onClick={() => handlePlaySong(song)}
                  className="min-w-0 flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity duration-200"
                >
                  <p className={cn(
                    "truncate font-medium",
                    isCurrentSong ? "text-accent" : "text-foreground"
                  )}>
                    {song.title}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {song.artist}
                  </p>
                </button>

                {/* Duration */}
                <span className="hidden sm:block w-16 text-right text-sm tabular-nums text-muted-foreground">
                  {formatDuration(song.duration)}
                </span>

                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(song.id)}
                  disabled={!user || loadingFavorite === song.id}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 cursor-pointer active:scale-95",
                    "hover:bg-accent/20 hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed",
                    favorites.has(song.id)
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground"
                  )}
                >
                  {loadingFavorite === song.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className={cn("h-5 w-5", favorites.has(song.id) && "fill-current")} />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
