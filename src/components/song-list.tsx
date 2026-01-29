"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Play, Pause, Shuffle, Loader2, Music } from "lucide-react"
import { usePlayerStore } from "@/store/player-store"
import { useSongsStore } from "@/store/songs-store"
import { useAuth } from "@/lib/auth/context"
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

  console.log("[addFavorite] Sending POST request", { url, userId, songId });

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

  console.log("[addFavorite] Response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("[addFavorite] Error response:", errorText);
  }

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
  
  // グローバルストアから曲を取得
  const { songs, isLoading, fetchSongs } = useSongsStore()
  
  const { user, session } = useAuth()
  const { currentSong, isPlaying, playSong, toggle } = usePlayerStore()

  // コンポーネントマウント時に曲を取得
  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  // Debug: ユーザー状態を確認
  useEffect(() => {
    console.log("[SongList] Auth state:", { 
      userId: user?.id, 
      hasSession: !!session, 
      hasAccessToken: !!session?.access_token 
    })
  }, [user, session])

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

  const toggleFavorite = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("[Favorite] toggleFavorite called", { songId, userId: user?.id, hasToken: !!session?.access_token })
    
    if (!user || !session?.access_token) {
      console.log("[Favorite] No user or token, returning early")
      return
    }

    setLoadingFavorite(songId)
    try {
      const isFavorite = favorites.has(songId)
      console.log("[Favorite] Current state:", { isFavorite })

      if (isFavorite) {
        console.log("[Favorite] Removing favorite...")
        const success = await removeFavorite(user.id, songId, session.access_token)
        console.log("[Favorite] Remove result:", success)
        if (success) {
          setFavorites((prev) => {
            const next = new Set(prev)
            next.delete(songId)
            return next
          })
        }
      } else {
        console.log("[Favorite] Adding favorite...")
        const success = await addFavorite(user.id, songId, session.access_token)
        console.log("[Favorite] Add result:", success)
        if (success) {
          setFavorites((prev) => new Set(prev).add(songId))
        }
      }
    } catch (error) {
      console.error("[Favorite] Error toggling favorite:", error)
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
      {/* Header */}
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/60 to-primary/60 shadow-xl">
          <Music className="h-20 w-20 text-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">STATION</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">BizSound Radio</h1>
          <p className="mt-2 text-muted-foreground">
            24/7 Store Music Stream
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {songs.length} tracks
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
          {/* Song Rows */}
          {songs.map((song) => {
            const isCurrentSong = currentSong?.id === song.id
            const isPlayingThis = isCurrentSong && isPlaying

            return (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all",
                  isCurrentSong
                    ? "bg-accent/20 text-accent"
                    : "hover:bg-secondary/50"
                )}
              >
                {/* Play/Pause Icon */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  {isPlayingThis ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </div>

                {/* Song Info */}
                <div className="min-w-0 flex-1">
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
                <span className="hidden sm:block w-16 text-right text-sm tabular-nums text-muted-foreground">
                  {formatDuration(song.duration)}
                </span>

                {/* Favorite Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    console.log("[FavoriteBtn] Button clicked!", { songId: song.id, user: !!user })
                    toggleFavorite(song.id, e)
                  }}
                  disabled={!user || loadingFavorite === song.id}
                  className={cn(
                    "h-8 w-8 shrink-0",
                    favorites.has(song.id)
                      ? "text-accent"
                      : "text-muted-foreground md:opacity-0 md:group-hover:opacity-100"
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
