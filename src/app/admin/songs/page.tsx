"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Play,
  Loader2,
  Music
} from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { deleteSong } from "@/lib/api/songs"
import type { Song } from "@/types/database"

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const genreLabels: Record<string, string> = {
  jazz: "ジャズ",
  pop: "ポップ",
  bossa_nova: "ボサノバ",
  classical: "クラシック",
  ambient: "アンビエント",
  lounge: "ラウンジ",
  electronic: "エレクトロニック",
  acoustic: "アコースティック",
  world: "ワールド",
  r_and_b: "R&B",
}

const moodLabels: Record<string, string> = {
  morning: "朝",
  afternoon: "昼",
  evening: "夕方",
  night: "夜",
  upbeat: "アップビート",
  relaxing: "リラックス",
  energetic: "エネルギッシュ",
  romantic: "ロマンティック",
  focus: "集中",
  celebration: "お祝い",
}

export default function SongsAdminPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchSongs()
  }, [])

  async function fetchSongs() {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setSongs(data || [])
    } catch (error) {
      console.error("Error fetching songs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("この楽曲を削除しますか？")) return
    
    try {
      setActionLoading(id)
      await deleteSong(id)
      await fetchSongs()
    } catch (error) {
      console.error("Error deleting song:", error)
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">楽曲管理</h1>
          <p className="mt-2 text-muted-foreground">
            楽曲のアップロード・編集・削除を管理します
          </p>
        </div>
        <Link href="/admin/songs/new">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            新規アップロード
          </Button>
        </Link>
      </div>

      {/* Songs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    楽曲
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    ジャンル
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    ムード
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    長さ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    再生回数
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    ステータス
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-secondary">
                          {song.cover_image_url ? (
                            <img
                              src={song.cover_image_url}
                              alt={song.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Music className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{song.title}</p>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500">
                        {genreLabels[song.genre] || song.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-500">
                        {moodLabels[song.mood] || song.mood}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {formatDuration(song.duration)}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {song.play_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          song.is_active
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {song.is_active ? "有効" : "無効"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="プレビュー"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Link href={`/admin/songs/${song.id}/edit`}>
                          <Button size="icon" variant="ghost" title="編集">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(song.id)}
                          disabled={actionLoading === song.id}
                          className="text-destructive hover:text-destructive"
                          title="削除"
                        >
                          {actionLoading === song.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {songs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      楽曲がありません。「新規アップロード」から追加してください。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
