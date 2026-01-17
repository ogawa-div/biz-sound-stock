"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2,
  ListMusic
} from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { publishPlaylist, unpublishPlaylist, deletePlaylist } from "@/lib/api/playlists"
import type { Playlist } from "@/types/database"

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}時間${minutes}分`
  }
  return `${minutes}分`
}

export default function PlaylistsAdminPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  async function fetchPlaylists() {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPlaylists(data || [])
    } catch (error) {
      console.error("Error fetching playlists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleTogglePublish(playlist: Playlist) {
    try {
      setActionLoading(playlist.id)
      if (playlist.is_public) {
        await unpublishPlaylist(playlist.id)
      } else {
        await publishPlaylist(playlist.id)
      }
      await fetchPlaylists()
    } catch (error) {
      console.error("Error toggling publish:", error)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("このプレイリストを削除しますか？")) return
    
    try {
      setActionLoading(id)
      await deletePlaylist(id)
      await fetchPlaylists()
    } catch (error) {
      console.error("Error deleting playlist:", error)
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
          <h1 className="text-3xl font-bold text-foreground">プレイリスト管理</h1>
          <p className="mt-2 text-muted-foreground">
            プレイリストの作成・編集・公開設定を管理します
          </p>
        </div>
        <Link href="/admin/playlists/new">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      {/* Playlists Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    プレイリスト
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    曲数
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    再生時間
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    ステータス
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    作成日
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody>
                {playlists.map((playlist) => (
                  <tr key={playlist.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                          {playlist.cover_image_url ? (
                            <img
                              src={playlist.cover_image_url}
                              alt={playlist.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ListMusic className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{playlist.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {playlist.description || "説明なし"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {playlist.track_count}曲
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {formatDuration(playlist.total_duration)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          playlist.is_public
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {playlist.is_public ? "公開中" : "下書き"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(playlist.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleTogglePublish(playlist)}
                          disabled={actionLoading === playlist.id}
                          title={playlist.is_public ? "非公開にする" : "公開する"}
                        >
                          {actionLoading === playlist.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : playlist.is_public ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/admin/playlists/${playlist.id}/edit`}>
                          <Button size="icon" variant="ghost" title="編集">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(playlist.id)}
                          disabled={actionLoading === playlist.id}
                          className="text-destructive hover:text-destructive"
                          title="削除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {playlists.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      プレイリストがありません。「新規作成」から追加してください。
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
