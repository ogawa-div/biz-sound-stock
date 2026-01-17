# 🗄️ BizSound Stock - データベース設計

## ER図（概念）

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   profiles  │     │  playlists  │     │    songs    │
│─────────────│     │─────────────│     │─────────────│
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ email       │     │ title       │     │ title       │
│ business_   │     │ is_public   │◄────│ artist      │
│   type      │     │ created_at  │     │ file_key    │
│ is_admin    │     │ ...         │     │ genre       │
└─────────────┘     └─────────────┘     │ mood        │
       │                   │            └─────────────┘
       │                   │                   │
       │            ┌──────┴──────┐            │
       │            │             │            │
       │     ┌──────▼──────┐      │            │
       │     │playlist_songs│     │            │
       │     │─────────────│      │            │
       │     │ playlist_id │──────┘            │
       │     │ song_id     │───────────────────┘
       │     │ sort_order  │
       │     └─────────────┘
       │
       │     ┌─────────────┐
       └────►│  play_logs  │
             │─────────────│
             │ user_id     │
             │ song_id     │
             │ played_at   │
             └─────────────┘
```

---

## テーブル詳細

### 1. profiles（ユーザー）

Supabase Auth と連携するユーザー拡張テーブル

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK(auth.users) | Supabase Auth ID |
| email | text | UNIQUE, NOT NULL | メールアドレス |
| display_name | text | | 表示名 |
| business_type | business_type | DEFAULT 'cafe' | 業種 |
| business_name | text | | 店舗名 |
| is_admin | boolean | DEFAULT false | 管理者フラグ |
| avatar_url | text | | プロフィール画像 |
| **stripe_customer_id** | text | | Stripe顧客ID |
| **subscription_status** | text | DEFAULT 'none' | サブスク状態 |
| **subscription_plan** | text | | プラン種別 |
| **trial_ends_at** | timestamptz | | トライアル終了日 |
| created_at | timestamptz | DEFAULT now() | 作成日時 |
| updated_at | timestamptz | DEFAULT now() | 更新日時 |

**subscription_status の値**:
- `none` - 未登録
- `trialing` - トライアル中
- `active` - 有効（課金中）
- `past_due` - 支払い遅延
- `canceled` - 解約済み

**subscription_plan の値**:
- `free` - 無料プラン
- `premium` - プレミアム（月額）
- `enterprise` - エンタープライズ

**トリガー**:
- `on_auth_user_created`: 新規ユーザー作成時に自動で profiles レコード作成
- `update_updated_at`: 更新時に updated_at を自動更新

---

### 2. songs（楽曲）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT uuid_generate_v4() | 楽曲ID |
| title | text | NOT NULL | 曲名 |
| artist | text | NOT NULL | アーティスト名 |
| album | text | | アルバム名 |
| file_key | text | NOT NULL | R2上のファイルパス |
| cover_image_url | text | | カバー画像URL |
| duration | integer | NOT NULL | 再生時間（秒） |
| genre | music_genre | NOT NULL | ジャンル |
| mood | music_mood | NOT NULL | ムード |
| bpm | integer | | BPM |
| is_active | boolean | DEFAULT true | 有効フラグ |
| play_count | integer | DEFAULT 0 | 再生回数 |
| created_at | timestamptz | DEFAULT now() | 作成日時 |
| updated_at | timestamptz | DEFAULT now() | 更新日時 |

**インデックス**:
- `idx_songs_genre`: genre での検索高速化
- `idx_songs_mood`: mood での検索高速化
- `idx_songs_created_at`: 作成日でのソート

---

### 3. playlists（プレイリスト）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | プレイリストID |
| title | text | NOT NULL | プレイリスト名 |
| description | text | | 説明文 |
| cover_image_url | text | | カバー画像 |
| **is_public** | boolean | DEFAULT false | 公開フラグ |
| is_featured | boolean | DEFAULT false | おすすめフラグ |
| target_business_type | business_type[] | | 対象業種（配列） |
| primary_genre | music_genre | | メインジャンル |
| primary_mood | music_mood | | メインムード |
| total_duration | integer | DEFAULT 0 | 合計時間（自動計算） |
| track_count | integer | DEFAULT 0 | 曲数（自動計算） |
| created_by | uuid | FK(profiles) | 作成者 |
| **created_at** | timestamptz | DEFAULT now() | 作成日時（New Releases用） |
| updated_at | timestamptz | DEFAULT now() | 更新日時 |
| published_at | timestamptz | | 公開日時 |

**インデックス**:
- `idx_playlists_public_created`: (is_public, created_at DESC) - New Releases用
- `idx_playlists_featured`: is_featured = true の高速検索
- `idx_playlists_business_type`: GINインデックス（配列検索）

**重要な挙動**:
- `is_public = true` のプレイリストのみユーザー画面に表示
- `created_at` 降順で「New Releases」に表示

---

### 4. playlist_songs（中間テーブル）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | レコードID |
| playlist_id | uuid | FK(playlists), NOT NULL | プレイリストID |
| song_id | uuid | FK(songs), NOT NULL | 楽曲ID |
| sort_order | integer | DEFAULT 0, NOT NULL | 再生順序 |
| added_at | timestamptz | DEFAULT now() | 追加日時 |

**制約**:
- UNIQUE(playlist_id, song_id): 同じ曲は1プレイリストに1回のみ

**トリガー**:
- `update_playlist_stats_trigger`: 曲追加/削除時に playlists の track_count, total_duration を自動更新

---

### 5. play_logs（再生ログ）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | ログID |
| user_id | uuid | FK(profiles), NOT NULL | ユーザーID |
| song_id | uuid | FK(songs), NOT NULL | 楽曲ID |
| playlist_id | uuid | FK(playlists) | プレイリストID（nullable） |
| played_at | timestamptz | DEFAULT now() | 再生日時 |
| duration_played | integer | DEFAULT 0 | 実際の再生秒数 |
| completed | boolean | DEFAULT false | 最後まで再生したか |

**トリガー**:
- `increment_song_play_count`: 30秒以上再生で songs.play_count をインクリメント

**インデックス**:
- `idx_play_logs_user`: (user_id, played_at DESC)
- `idx_play_logs_song`: (song_id, played_at DESC)
- `idx_play_logs_analytics`: (played_at DESC, song_id) - 分析用

---

### 6. user_favorites（お気に入り）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | レコードID |
| user_id | uuid | FK(profiles), NOT NULL | ユーザーID |
| playlist_id | uuid | FK(playlists) | プレイリストID |
| song_id | uuid | FK(songs) | 楽曲ID |
| created_at | timestamptz | DEFAULT now() | 追加日時 |

**制約**:
- CHECK: playlist_id か song_id のどちらか一方のみ設定
- UNIQUE(user_id, playlist_id)
- UNIQUE(user_id, song_id)

---

## ENUM定義

### business_type

```sql
CREATE TYPE business_type AS ENUM (
  'cafe', 'restaurant', 'salon', 'retail',
  'hotel', 'gym', 'spa', 'other'
);
```

### music_genre

```sql
CREATE TYPE music_genre AS ENUM (
  'jazz', 'pop', 'bossa_nova', 'classical',
  'ambient', 'lounge', 'electronic', 'acoustic',
  'world', 'r_and_b'
);
```

### music_mood

```sql
CREATE TYPE music_mood AS ENUM (
  'morning', 'afternoon', 'evening', 'night',
  'upbeat', 'relaxing', 'energetic', 'romantic',
  'focus', 'celebration'
);
```

---

## RLS（Row Level Security）ポリシー

### profiles
- **SELECT**: 自分のプロフィールのみ閲覧可能
- **UPDATE**: 自分のプロフィールのみ更新可能
- **管理者**: 全プロフィール閲覧可能

### songs
- **SELECT**: 認証済みユーザーは `is_active = true` の曲を閲覧可能
- **ALL**: 管理者のみ全操作可能

### playlists
- **SELECT**: 認証済みユーザーは `is_public = true` のみ閲覧可能
- **ALL**: 管理者のみ全操作可能

### play_logs
- **INSERT**: 自分のログのみ作成可能
- **SELECT**: 自分のログのみ閲覧可能（管理者は全件）

### user_favorites
- **ALL**: 自分のお気に入りのみ操作可能

---

## ビュー

### top_songs

人気曲ランキング

```sql
SELECT id, title, artist, genre, mood, play_count, duration
FROM songs
WHERE is_active = TRUE
ORDER BY play_count DESC;
```

### analytics_by_business_type

業種別再生統計

```sql
SELECT 
  p.business_type,
  s.genre,
  s.mood,
  COUNT(pl.id) as play_count,
  DATE_TRUNC('day', pl.played_at) as play_date
FROM play_logs pl
JOIN profiles p ON pl.user_id = p.id
JOIN songs s ON pl.song_id = s.id
GROUP BY p.business_type, s.genre, s.mood, DATE_TRUNC('day', pl.played_at);
```

---

## 関数

### get_new_releases(limit_count)

New Releases 取得用関数

```sql
SELECT * FROM get_new_releases(6);
```

---

## Storage バケット

### music（音楽ファイル）

| 設定 | 値 |
|------|-----|
| 公開 | ❌ (認証必須) |
| 用途 | MP3ファイル |

**ポリシー**:
- SELECT: 認証済みユーザーのみ
- INSERT: 管理者のみ
- DELETE: 管理者のみ

### covers（カバー画像）

| 設定 | 値 |
|------|-----|
| 公開 | ✅ |
| 用途 | プレイリスト/楽曲のカバー画像 |

**ポリシー**:
- SELECT: 全員
- INSERT: 管理者のみ
- DELETE: 管理者のみ

---

## マイグレーション

スキーマの変更履歴は `supabase/schema.sql` で管理。

本番環境への適用時は Supabase Dashboard の SQL Editor を使用。

将来的には Supabase CLI でのマイグレーション管理を検討：

```bash
supabase db diff
supabase db push
```
