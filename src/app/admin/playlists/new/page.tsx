"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import Link from "next/link"
import { createPlaylist } from "@/lib/api/playlists"
import type { BusinessType, MusicGenre, MusicMood } from "@/types/database"

const businessTypes: { value: BusinessType; label: string }[] = [
  { value: "cafe", label: "カフェ" },
  { value: "restaurant", label: "レストラン" },
  { value: "salon", label: "美容室" },
  { value: "retail", label: "アパレル" },
  { value: "hotel", label: "ホテル" },
  { value: "gym", label: "ジム" },
  { value: "spa", label: "スパ" },
  { value: "other", label: "その他" },
]

const genres: { value: MusicGenre; label: string }[] = [
  { value: "jazz", label: "ジャズ" },
  { value: "pop", label: "ポップ" },
  { value: "bossa_nova", label: "ボサノバ" },
  { value: "classical", label: "クラシック" },
  { value: "ambient", label: "アンビエント" },
  { value: "lounge", label: "ラウンジ" },
  { value: "electronic", label: "エレクトロニック" },
  { value: "acoustic", label: "アコースティック" },
  { value: "world", label: "ワールド" },
  { value: "r_and_b", label: "R&B" },
]

const moods: { value: MusicMood; label: string }[] = [
  { value: "morning", label: "朝" },
  { value: "afternoon", label: "昼" },
  { value: "evening", label: "夕方" },
  { value: "night", label: "夜" },
  { value: "upbeat", label: "アップビート" },
  { value: "relaxing", label: "リラックス" },
  { value: "energetic", label: "エネルギッシュ" },
  { value: "romantic", label: "ロマンティック" },
  { value: "focus", label: "集中" },
  { value: "celebration", label: "お祝い" },
]

export default function NewPlaylistPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cover_image_url: "",
    is_public: false,
    is_featured: false,
    target_business_type: [] as BusinessType[],
    primary_genre: "" as MusicGenre | "",
    primary_mood: "" as MusicMood | "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) {
      alert("タイトルを入力してください")
      return
    }

    try {
      setIsSubmitting(true)
      await createPlaylist({
        title: formData.title,
        description: formData.description || undefined,
        cover_image_url: formData.cover_image_url || undefined,
        is_public: formData.is_public,
        is_featured: formData.is_featured,
        target_business_type: formData.target_business_type.length > 0 
          ? formData.target_business_type 
          : undefined,
        primary_genre: formData.primary_genre || undefined,
        primary_mood: formData.primary_mood || undefined,
      })
      router.push("/admin/playlists")
    } catch (error) {
      console.error("Error creating playlist:", error)
      alert("プレイリストの作成に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleBusinessType = (type: BusinessType) => {
    setFormData((prev) => ({
      ...prev,
      target_business_type: prev.target_business_type.includes(type)
        ? prev.target_business_type.filter((t) => t !== type)
        : [...prev.target_business_type, type],
    }))
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/playlists"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          プレイリスト一覧に戻る
        </Link>
        <h1 className="text-3xl font-bold text-foreground">新規プレイリスト作成</h1>
        <p className="mt-2 text-muted-foreground">
          新しいプレイリストを作成します。公開すると「ニューリリース」に表示されます。
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    タイトル <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="例: スプリングカフェ2024"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">説明</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="プレイリストの説明を入力"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">カバー画像URL</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="url"
                      value={formData.cover_image_url}
                      onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="https://..."
                    />
                    <Button type="button" variant="outline" disabled>
                      <Upload className="mr-2 h-4 w-4" />
                      アップロード
                    </Button>
                  </div>
                  {formData.cover_image_url && (
                    <div className="mt-2 h-32 w-32 overflow-hidden rounded-md bg-secondary">
                      <img
                        src={formData.cover_image_url}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>カテゴリ設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">対象業種</label>
                  <p className="mb-2 text-sm text-muted-foreground">
                    このプレイリストに適した業種を選択（複数選択可）
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {businessTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => toggleBusinessType(type.value)}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                          formData.target_business_type.includes(type.value)
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">メインジャンル</label>
                    <select
                      value={formData.primary_genre}
                      onChange={(e) => setFormData({ ...formData, primary_genre: e.target.value as MusicGenre })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">選択してください</option>
                      {genres.map((genre) => (
                        <option key={genre.value} value={genre.value}>
                          {genre.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">メインムード</label>
                    <select
                      value={formData.primary_mood}
                      onChange={(e) => setFormData({ ...formData, primary_mood: e.target.value as MusicMood })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">選択してください</option>
                      {moods.map((mood) => (
                        <option key={mood.value} value={mood.value}>
                          {mood.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>公開設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                  />
                  <div>
                    <p className="font-medium text-foreground">公開する</p>
                    <p className="text-sm text-muted-foreground">
                      ニューリリースに表示されます
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                  />
                  <div>
                    <p className="font-medium text-foreground">おすすめに表示</p>
                    <p className="text-sm text-muted-foreground">
                      トップページのおすすめに表示
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      作成中...
                    </>
                  ) : (
                    "プレイリストを作成"
                  )}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  作成後、楽曲を追加できます
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
