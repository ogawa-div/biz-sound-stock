-- ===========================================
-- BizSound Stock - セキュリティ問題修正スクリプト
-- Supabase Security Advisorのエラーを解決
-- 
-- 【実行方法】
-- 1. Supabase Dashboard → SQL Editor に移動
-- 2. このファイルの内容をコピー＆ペースト
-- 3. "Run" をクリック
-- ===========================================

-- ===========================================
-- Part 1: RLS有効化
-- 問題: rls_disabled_in_public, policy_exists_rls_disabled
-- ===========================================

-- profiles テーブル
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- play_logs テーブル
ALTER TABLE public.play_logs ENABLE ROW LEVEL SECURITY;

-- playlist_songs テーブル
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;

-- playlists テーブル
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- songs テーブル（念のため）
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- user_favorites テーブル（念のため）
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- Part 2: SECURITY DEFINER ビューの修正
-- 問題: security_definer_view
-- 
-- SECURITY DEFINER → SECURITY INVOKER に変更
-- これにより、ビューを呼び出すユーザーの権限でRLSが適用される
-- ===========================================

-- top_songs ビューを再作成
DROP VIEW IF EXISTS public.top_songs;
CREATE VIEW public.top_songs 
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

-- analytics_by_business_type ビューを再作成
DROP VIEW IF EXISTS public.analytics_by_business_type;
CREATE VIEW public.analytics_by_business_type
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
-- Part 3: ポリシーの確認・再作成
-- 既存のポリシーがあれば維持、なければ作成
-- ===========================================

-- profiles ポリシー
DO $$
BEGIN
  -- 既存ポリシーがなければ作成
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- play_logs ポリシー
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'play_logs' AND policyname = 'Users can insert their own play logs'
  ) THEN
    CREATE POLICY "Users can insert their own play logs"
      ON play_logs FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'play_logs' AND policyname = 'Users can view their own play logs'
  ) THEN
    CREATE POLICY "Users can view their own play logs"
      ON play_logs FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- playlist_songs ポリシー
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'playlist_songs' AND policyname = 'Authenticated users can view public playlist songs'
  ) THEN
    CREATE POLICY "Authenticated users can view public playlist songs"
      ON playlist_songs FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM playlists WHERE id = playlist_id AND is_public = TRUE
        )
      );
  END IF;
END $$;

-- playlists ポリシー
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'playlists' AND policyname = 'Authenticated users can view public playlists'
  ) THEN
    CREATE POLICY "Authenticated users can view public playlists"
      ON playlists FOR SELECT
      TO authenticated
      USING (is_public = TRUE);
  END IF;
END $$;

-- ===========================================
-- 確認用クエリ
-- ===========================================

-- RLSが有効になっているか確認
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'songs', 'playlists', 'playlist_songs', 'play_logs', 'user_favorites')
ORDER BY tablename;

-- ビューのセキュリティ設定を確認
SELECT 
  table_name,
  view_definition
FROM information_schema.views 
WHERE table_schema = 'public'
  AND table_name IN ('top_songs', 'analytics_by_business_type');

-- ===========================================
-- 完了メッセージ
-- ===========================================
-- 上記のクエリ結果で以下を確認してください:
-- 1. すべてのテーブルの rowsecurity が 'true' になっている
-- 2. ビューが正常に再作成されている
--
-- その後、Supabase Dashboard → Database → Security Advisor で
-- エラーが解消されているか再確認してください。
-- ===========================================
