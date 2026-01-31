"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Play, Pause, Shuffle, Loader2, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { usePlayerStore } from "@/store/player-store"
import { Sidebar } from "@/components/sidebar"
import { MusicPlayer } from "@/components/music-player"
import type { Song } from "@/types/database"
import { cn } from "@/lib/utils"
import Link from "next/link"

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

// お気に入りと曲情報を取得
async function fetchFavoriteSongs(userId: string, accessToken: string): Promise<Song[]> {
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // まずお気に入りのsong_idを取得
  const favUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_favorites?select=song_id&user_id=eq.${userId}&song_id=not.is.null`;
  const favResponse = await fetch(favUrl, {
    headers: {
      "apikey": apiKey || "",
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  
  if (!favResponse.ok) return [];
  const favData = await favResponse.json();
  
  if (favData.length === 0) return [];
  
  // song_idのリストを取得
  const songIds = favData.map((f: { song_id: string }) => f.song_id);
  
  // 曲情報を取得
  const songsUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/songs?id=in.(${songIds.join(",")})`;
  const songsResponse = await fetch(songsUrl, {
    headers: {
      "apikey": apiKey || "",
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  
  if (!songsResponse.ok) return [];
  return songsResponse.json();
}

// お気に入りから削除
async function removeFavoriteFromDB(userId: string, songId: string, accessToken: string): Promise<boolean> {
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

function FavoriteSongList() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  
  const { user, session, isLoading: authLoading } = useAuth()
  const { currentSong, isPlaying, playSong, toggle } = usePlayerStore()

  // Fetch favorite songs
  useEffect(() => {
    let isMounted = true
    
    // タイムアウト: 5秒以上続いたらローディングを終了
    const timeout = setTimeout(() => {
      if (isMounted && isLoading) {
        setIsLoading(false)
      }
    }, 5000)

    async function fetchFavorites() {
      // 未ログインまたはセッションがない場合は即座にローディング終了
      if (!user || !session?.access_token) {
        if (isMounted) {
          setIsLoading(false)
        }
        return
      }

      try {
        const favSongs = await fetchFavoriteSongs(user.id, session.access_token)
        if (isMounted) {
          setSongs(favSongs)
        }
      } catch (error) {
        console.error("Error fetching favorites:", error)
        if (isMounted) {
          setSongs([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // authLoading が完了したら実行
    if (!authLoading) {
      fetchFavorites()
    }

    return () => {
      isMounted = false
      clearTimeout(timeout)
    }
  }, [user, session, authLoading, isLoading])

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

  const removeFavorite = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user || !session?.access_token) return

    setRemovingId(songId)
    try {
      const success = await removeFavoriteFromDB(user.id, songId, session.access_token)
      if (success) {
        setSongs((prev) => prev.filter((s) => s.id !== songId))
      }
    } catch (error) {
      console.error("Error removing favorite:", error)
    } finally {
      setRemovingId(null)
    }
  }

  // ローディング中（ただしタイムアウトで打ち切り）
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8 flex items-center gap-6">
          <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/50 to-rose-500/50">
            <Heart className="h-20 w-20 text-foreground/60" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase text-muted-foreground">プレイリスト</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">お気に入り</h1>
            <div className="mt-4 h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-8">
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
      {/* Header */}
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/60 to-rose-500/60 shadow-xl">
          <Heart className="h-20 w-20 text-foreground fill-current" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase text-muted-foreground">プレイリスト</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">お気に入り</h1>
          <p className="mt-2 text-muted-foreground">
            お気に入りに追加した曲
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {songs.length} 曲
          </p>
        </div>
      </div>

      {/* Play All Button */}
      {songs.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <Button
            size="lg"
            onClick={handlePlayAll}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Shuffle className="h-5 w-5" />
            シャッフル再生
          </Button>
        </div>
      )}

      {/* Song List */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg text-muted-foreground">
            お気に入りの曲がありません
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            ホームで曲のハートアイコンをクリックして追加してください
          </p>
          <Link href="/" className="mt-4">
            <Button variant="outline">ホームに戻る</Button>
          </Link>
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

                {/* Remove Favorite Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => removeFavorite(song.id, e)}
                  disabled={removingId === song.id}
                  className="h-8 w-8 text-accent"
                >
                  {removingId === song.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className="h-4 w-4 fill-current" />
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

export default function FavoritesPage() {
  return (
    <div className="flex h-safe-screen flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main 
          className="flex-1 overflow-y-auto overscroll-none md:pt-0"
          style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}
        >
          <FavoriteSongList />
        </main>
      </div>
      <MusicPlayer />
    </div>
  )
}
