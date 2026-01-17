"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Upload, Music, X } from "lucide-react"
import Link from "next/link"
import type { MusicGenre, MusicMood } from "@/types/database"

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

export default function NewSongPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "" as MusicGenre | "",
    mood: "" as MusicMood | "",
    bpm: "",
    cover_image_url: "",
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "audio/mpeg") {
      setSelectedFile(file)
      // Auto-fill title from filename if empty
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.mp3$/i, "")
        setFormData((prev) => ({ ...prev, title: nameWithoutExt }))
      }
    } else {
      alert("MP3ファイルを選択してください")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert("MP3ファイルを選択してください")
      return
    }
    
    if (!formData.title || !formData.artist || !formData.genre || !formData.mood) {
      alert("必須項目を入力してください")
      return
    }

    try {
      setIsSubmitting(true)

      // Create form data for upload
      const uploadData = new FormData()
      uploadData.append("file", selectedFile)
      uploadData.append("title", formData.title)
      uploadData.append("artist", formData.artist)
      uploadData.append("album", formData.album)
      uploadData.append("genre", formData.genre)
      uploadData.append("mood", formData.mood)
      if (formData.bpm) uploadData.append("bpm", formData.bpm)
      if (formData.cover_image_url) uploadData.append("cover_image_url", formData.cover_image_url)

      const response = await fetch("/api/admin/songs/upload", {
        method: "POST",
        body: uploadData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      router.push("/admin/songs")
    } catch (error) {
      console.error("Error uploading song:", error)
      alert("楽曲のアップロードに失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/songs"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          楽曲一覧に戻る
        </Link>
        <h1 className="text-3xl font-bold text-foreground">新規楽曲アップロード</h1>
        <p className="mt-2 text-muted-foreground">
          MP3ファイルをアップロードして楽曲を登録します
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>音声ファイル</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/mpeg,.mp3"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <Music className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-8 transition-colors hover:border-accent hover:bg-secondary/50"
                  >
                    <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                    <p className="font-medium text-foreground">
                      クリックしてMP3ファイルを選択
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      またはドラッグ＆ドロップ
                    </p>
                  </button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      タイトル <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="曲名"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      アーティスト <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="アーティスト名"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">アルバム</label>
                    <input
                      type="text"
                      value={formData.album}
                      onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="アルバム名（任意）"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">BPM</label>
                    <input
                      type="number"
                      value={formData.bpm}
                      onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="例: 120"
                      min="40"
                      max="200"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">カバー画像URL</label>
                  <input
                    type="url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>カテゴリ設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      ジャンル <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value as MusicGenre })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
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
                    <label className="text-sm font-medium text-foreground">
                      ムード <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={formData.mood}
                      onChange={(e) => setFormData({ ...formData, mood: e.target.value as MusicMood })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      required
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
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isSubmitting || !selectedFile}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      アップロード中...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      楽曲をアップロード
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  MP3ファイルはCloudflare R2に保存されます
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">アップロード要件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• ファイル形式: MP3</p>
                <p>• 最大ファイルサイズ: 50MB</p>
                <p>• 推奨ビットレート: 320kbps</p>
                <p>• サンプルレート: 44.1kHz</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
