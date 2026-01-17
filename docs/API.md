# 🔌 BizSound Stock - API リファレンス

## 概要

BizSound Stock の API は以下の2種類で構成されています：

1. **クライアントAPI** - Supabase を直接呼び出す関数（`src/lib/api/`）
2. **サーバーAPI** - Next.js API Routes（`src/app/api/`）

---

## 1. プレイリスト API

### `getNewReleases(limit?: number)`

New Releases 用のプレイリスト取得

```typescript
import { getNewReleases } from "@/lib/api/playlists"

const playlists = await getNewReleases(6)
```

| パラメータ | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| limit | number | 6 | 取得件数 |

**返り値**: `Playlist[]`

**クエリ条件**:
- `is_public = true`
- `created_at DESC` でソート

---

### `getFeaturedPlaylists()`

おすすめプレイリスト取得

```typescript
import { getFeaturedPlaylists } from "@/lib/api/playlists"

const playlists = await getFeaturedPlaylists()
```

**返り値**: `Playlist[]`

**クエリ条件**:
- `is_public = true`
- `is_featured = true`

---

### `getPlaylistsByBusinessType(businessType: string)`

業種別プレイリスト取得

```typescript
const playlists = await getPlaylistsByBusinessType("cafe")
```

---

### `getPlaylistById(id: string)`

単一プレイリスト取得

```typescript
const playlist = await getPlaylistById("uuid-here")
```

**返り値**: `Playlist | null`

---

### `getPlaylistSongs(playlistId: string)`

プレイリスト内の曲一覧取得

```typescript
const songs = await getPlaylistSongs("playlist-uuid")
```

**返り値**: `Song[]`（sort_order順）

---

### `createPlaylist(data)`（管理者用）

新規プレイリスト作成

```typescript
const playlist = await createPlaylist({
  title: "スプリングカフェ",
  description: "春の新作プレイリスト",
  is_public: false,
  is_featured: false,
  primary_genre: "jazz",
  primary_mood: "morning",
  target_business_type: ["cafe", "restaurant"]
})
```

---

### `publishPlaylist(id: string)` / `unpublishPlaylist(id: string)`

公開/非公開切り替え

```typescript
await publishPlaylist("playlist-uuid")  // is_public = true
await unpublishPlaylist("playlist-uuid") // is_public = false
```

---

## 2. 楽曲 API

### `getAllSongs()`

全楽曲取得（有効なもののみ）

```typescript
import { getAllSongs } from "@/lib/api/songs"

const songs = await getAllSongs()
```

---

### `getSongsByGenre(genre: MusicGenre)`

ジャンル別楽曲取得

```typescript
const jazzSongs = await getSongsByGenre("jazz")
```

---

### `getSongsByMood(mood: MusicMood)`

ムード別楽曲取得

```typescript
const relaxingSongs = await getSongsByMood("relaxing")
```

---

### `getTopSongs(limit?: number)`

人気曲ランキング取得

```typescript
const topSongs = await getTopSongs(10)
```

---

### `searchSongs(query: string)`

楽曲検索

```typescript
const results = await searchSongs("jazz cafe")
```

検索対象: title, artist, album

---

## 3. 再生ログ API

### `logPlay(userId, songId, playlistId?, durationPlayed?, completed?)`

再生ログ記録

```typescript
import { logPlay } from "@/lib/api/play-logs"

await logPlay(
  "user-uuid",
  "song-uuid",
  "playlist-uuid",
  180,  // 3分再生
  true  // 最後まで再生
)
```

**注意**: 30秒以上再生された場合に `songs.play_count` が自動インクリメント（DBトリガー）

---

### `getPlaysByBusinessType(startDate, endDate)`（管理者用）

業種別再生数取得

```typescript
const stats = await getPlaysByBusinessType(
  new Date("2024-01-01"),
  new Date("2024-01-31")
)
// [{ business_type: "cafe", play_count: 1234 }, ...]
```

---

### `getPlaysByGenre(startDate, endDate)`（管理者用）

ジャンル別再生数取得

```typescript
const stats = await getPlaysByGenre(startDate, endDate)
// [{ genre: "jazz", play_count: 5678 }, ...]
```

---

### `getDailyPlayCounts(startDate, endDate)`（管理者用）

日別再生数取得

```typescript
const daily = await getDailyPlayCounts(startDate, endDate)
// [{ date: "2024-01-15", play_count: 456 }, ...]
```

---

## 4. サーバー API Routes

### `POST /api/admin/songs/upload`

楽曲アップロード

**リクエスト**: `multipart/form-data`

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|:----:|------|
| file | File | ✅ | MP3ファイル（最大50MB） |
| title | string | ✅ | 曲名 |
| artist | string | ✅ | アーティスト名 |
| genre | string | ✅ | ジャンル |
| mood | string | ✅ | ムード |
| album | string | | アルバム名 |
| bpm | number | | BPM |
| cover_image_url | string | | カバー画像URL |

**レスポンス**:

```json
{
  "success": true,
  "song": {
    "id": "uuid",
    "title": "Morning Jazz",
    "file_key": "audio/1234567890-morning-jazz.mp3",
    ...
  }
}
```

**エラーレスポンス**:

```json
{
  "error": "Missing required fields"
}
```

---

## 5. 型定義

### Playlist

```typescript
interface Playlist {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  is_public: boolean
  is_featured: boolean
  target_business_type: BusinessType[] | null
  primary_genre: MusicGenre | null
  primary_mood: MusicMood | null
  total_duration: number
  track_count: number
  created_at: string
  updated_at: string
}
```

### Song

```typescript
interface Song {
  id: string
  title: string
  artist: string
  album: string | null
  file_key: string
  cover_image_url: string | null
  duration: number
  genre: MusicGenre
  mood: MusicMood
  bpm: number | null
  is_active: boolean
  play_count: number
  created_at: string
}
```

### Enum Types

```typescript
type BusinessType = 
  | "cafe" | "restaurant" | "salon" 
  | "retail" | "hotel" | "gym" | "spa" | "other"

type MusicGenre = 
  | "jazz" | "pop" | "bossa_nova" | "classical"
  | "ambient" | "lounge" | "electronic" | "acoustic"
  | "world" | "r_and_b"

type MusicMood = 
  | "morning" | "afternoon" | "evening" | "night"
  | "upbeat" | "relaxing" | "energetic" | "romantic"
  | "focus" | "celebration"
```

---

## 6. エラーハンドリング

すべてのAPI関数は例外をスローします：

```typescript
try {
  const playlists = await getNewReleases()
} catch (error) {
  console.error("Error:", error)
  // エラー処理
}
```

Supabase エラーの形式：

```typescript
{
  message: "...",
  details: "...",
  hint: "...",
  code: "PGRST..."
}
```
