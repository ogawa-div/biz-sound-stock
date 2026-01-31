-- ===========================================
-- BizSound Stock Database Schema
-- Store BGM Streaming Service
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- 1. ENUM Types
-- ===========================================

-- Business types for store owners
CREATE TYPE business_type AS ENUM (
  'cafe',
  'restaurant',
  'salon',
  'retail',
  'hotel',
  'gym',
  'spa',
  'other'
);

-- Music genre categories
CREATE TYPE music_genre AS ENUM (
  'jazz',
  'pop',
  'bossa_nova',
  'classical',
  'ambient',
  'lounge',
  'electronic',
  'acoustic',
  'world',
  'r_and_b'
);

-- Music mood categories
CREATE TYPE music_mood AS ENUM (
  'morning',
  'afternoon',
  'evening',
  'night',
  'upbeat',
  'relaxing',
  'energetic',
  'romantic',
  'focus',
  'celebration'
);

-- ===========================================
-- 2. Profiles Table
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  business_type business_type DEFAULT 'cafe',
  business_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  -- Stripe連携用
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'none', -- 'none', 'trialing', 'active', 'past_due', 'canceled'
  subscription_plan TEXT, -- 'free', 'premium', 'enterprise'
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  -- タイムスタンプ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===========================================
-- 3. Songs Table
-- ===========================================
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  file_key TEXT NOT NULL, -- R2 storage path
  cover_image_url TEXT,
  duration INTEGER NOT NULL, -- Duration in seconds
  genre music_genre NOT NULL,
  mood music_mood NOT NULL,
  bpm INTEGER, -- Beats per minute (optional)
  is_active BOOLEAN DEFAULT TRUE,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Songs policies
CREATE POLICY "Active songs are viewable by authenticated users"
  ON songs FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Admin can manage all songs"
  ON songs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Index for faster queries
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_songs_mood ON songs(mood);
CREATE INDEX idx_songs_created_at ON songs(created_at DESC);

-- ===========================================
-- 4. Playlists Table
-- ===========================================
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE, -- 公開フラグ: trueの場合のみNew Releasesに表示
  is_featured BOOLEAN DEFAULT FALSE, -- おすすめプレイリストとして表示
  target_business_type business_type[], -- 対象の業種（複数選択可）
  primary_genre music_genre,
  primary_mood music_mood,
  total_duration INTEGER DEFAULT 0, -- 合計再生時間（秒）
  track_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 新着順の並び替えに使用
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE -- 公開日時
);

-- Enable RLS
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

-- Playlists policies
CREATE POLICY "Public playlists are viewable by all authenticated users"
  ON playlists FOR SELECT
  TO authenticated
  USING (is_public = TRUE);

CREATE POLICY "Admin can manage all playlists"
  ON playlists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Index for faster queries (New Releases用)
CREATE INDEX idx_playlists_public_created ON playlists(is_public, created_at DESC);
CREATE INDEX idx_playlists_featured ON playlists(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_playlists_business_type ON playlists USING GIN(target_business_type);

-- ===========================================
-- 5. Playlist Songs (Junction Table)
-- ===========================================
CREATE TABLE playlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(playlist_id, song_id)
);

-- Enable RLS
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- Playlist songs policies
CREATE POLICY "Playlist songs viewable if playlist is public"
  ON playlist_songs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists WHERE id = playlist_id AND is_public = TRUE
    )
  );

CREATE POLICY "Admin can manage playlist songs"
  ON playlist_songs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Index for faster queries
CREATE INDEX idx_playlist_songs_playlist ON playlist_songs(playlist_id, sort_order);

-- ===========================================
-- 6. Play Logs Table (Analytics)
-- ===========================================
CREATE TABLE play_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES playlists(id) ON DELETE SET NULL,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_played INTEGER DEFAULT 0, -- 実際に再生した秒数
  completed BOOLEAN DEFAULT FALSE -- 最後まで再生したか
);

-- Enable RLS
ALTER TABLE play_logs ENABLE ROW LEVEL SECURITY;

-- Play logs policies
CREATE POLICY "Users can insert their own play logs"
  ON play_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own play logs"
  ON play_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all play logs"
  ON play_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Index for analytics queries
CREATE INDEX idx_play_logs_user ON play_logs(user_id, played_at DESC);
CREATE INDEX idx_play_logs_song ON play_logs(song_id, played_at DESC);
CREATE INDEX idx_play_logs_analytics ON play_logs(played_at DESC, song_id);

-- ===========================================
-- 7. User Favorites Table
-- ===========================================
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT favorites_check CHECK (
    (playlist_id IS NOT NULL AND song_id IS NULL) OR
    (playlist_id IS NULL AND song_id IS NOT NULL)
  ),
  UNIQUE(user_id, playlist_id),
  UNIQUE(user_id, song_id)
);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can manage their own favorites"
  ON user_favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- ===========================================
-- 8. Functions & Triggers
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update playlist stats when songs are added/removed
CREATE OR REPLACE FUNCTION update_playlist_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
    UPDATE playlists
    SET 
      track_count = (
        SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = COALESCE(NEW.playlist_id, OLD.playlist_id)
      ),
      total_duration = (
        SELECT COALESCE(SUM(s.duration), 0)
        FROM playlist_songs ps
        JOIN songs s ON ps.song_id = s.id
        WHERE ps.playlist_id = COALESCE(NEW.playlist_id, OLD.playlist_id)
      )
    WHERE id = COALESCE(NEW.playlist_id, OLD.playlist_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_playlist_stats_trigger
  AFTER INSERT OR DELETE ON playlist_songs
  FOR EACH ROW
  EXECUTE FUNCTION update_playlist_stats();

-- Function to increment song play count
CREATE OR REPLACE FUNCTION increment_play_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.duration_played >= 30 THEN -- 30秒以上再生でカウント
    UPDATE songs
    SET play_count = play_count + 1
    WHERE id = NEW.song_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_song_play_count
  AFTER INSERT ON play_logs
  FOR EACH ROW
  EXECUTE FUNCTION increment_play_count();

-- ===========================================
-- 9. Views for Analytics
-- ===========================================

-- View: Top songs by play count
-- SECURITY INVOKER: 呼び出すユーザーの権限でRLSが適用される
CREATE VIEW top_songs 
WITH (security_invoker = true)
AS
SELECT 
  s.id,
  s.title,
  s.artist,
  s.genre,
  s.mood,
  s.play_count,
  s.duration,
  s.cover_image_url
FROM songs s
WHERE s.is_active = TRUE
ORDER BY s.play_count DESC;

-- View: Play analytics by business type
-- SECURITY INVOKER: 呼び出すユーザーの権限でRLSが適用される
CREATE VIEW analytics_by_business_type
WITH (security_invoker = true)
AS
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

-- ===========================================
-- 10. Helper function for New Releases
-- ===========================================

-- Function to get new release playlists
CREATE OR REPLACE FUNCTION get_new_releases(limit_count INTEGER DEFAULT 6)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  cover_image_url TEXT,
  track_count INTEGER,
  total_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  primary_genre music_genre,
  primary_mood music_mood
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.cover_image_url,
    p.track_count,
    p.total_duration,
    p.created_at,
    p.primary_genre,
    p.primary_mood
  FROM playlists p
  WHERE p.is_public = TRUE
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- 11. Initial Profile Creation Trigger
-- ===========================================

-- Automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- 12. Storage Setup (Supabase Storage)
-- ===========================================

-- 音楽ファイル用バケット
INSERT INTO storage.buckets (id, name, public) 
VALUES ('music', 'music', false)
ON CONFLICT (id) DO NOTHING;

-- カバー画像用バケット（公開）
INSERT INTO storage.buckets (id, name, public) 
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies

-- カバー画像: 誰でも閲覧可能
CREATE POLICY "Public Access Covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');

-- 音楽ファイル: 認証済みユーザーのみ閲覧可能
CREATE POLICY "Authenticated Access Music"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'music' 
    AND auth.role() = 'authenticated'
  );

-- 音楽ファイル: 管理者のみアップロード可能
CREATE POLICY "Admin Insert Music"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'music' 
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- カバー画像: 管理者のみアップロード可能
CREATE POLICY "Admin Insert Covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers' 
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- 管理者のみ削除可能
CREATE POLICY "Admin Delete Objects"
  ON storage.objects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===========================================
-- 13. Subscription Status Enum (Optional)
-- ===========================================

-- サブスクリプション状態の参照用コメント
-- subscription_status の有効な値:
--   'none'     - 未登録
--   'trialing' - トライアル中
--   'active'   - 有効（課金中）
--   'past_due' - 支払い遅延
--   'canceled' - 解約済み
--   'paused'   - 一時停止

-- subscription_plan の有効な値:
--   'free'       - 無料プラン
--   'premium'    - プレミアム（月額）
--   'enterprise' - エンタープライズ

-- ===========================================
-- 14. Sample Data for Development (Optional)
-- ===========================================

-- 開発用サンプルデータ（本番では実行しない）
-- INSERT INTO playlists (title, description, is_public, is_featured, primary_genre, primary_mood)
-- VALUES 
--   ('Morning Cafe Jazz', 'カフェの朝に最適なジャズセレクション', true, true, 'jazz', 'morning'),
--   ('Salon Chill Mix', '美容室向けリラックスミュージック', true, true, 'lounge', 'relaxing'),
--   ('Restaurant Dinner', 'ディナータイムのBGM', true, false, 'bossa_nova', 'evening');
