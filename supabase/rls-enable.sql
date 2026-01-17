-- ===========================================
-- BizSound Stock - RLS有効化スクリプト
-- 本番デプロイ前に必ず実行してください
-- ===========================================

-- 既存のポリシーを削除（クリーンアップ）
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Active songs are viewable by authenticated users" ON songs;
DROP POLICY IF EXISTS "Active songs are viewable by everyone" ON songs;
DROP POLICY IF EXISTS "Admin can manage all songs" ON songs;
DROP POLICY IF EXISTS "Public playlists are viewable by everyone" ON playlists;
DROP POLICY IF EXISTS "Admin can manage all playlists" ON playlists;
DROP POLICY IF EXISTS "Playlist songs viewable if playlist is public" ON playlist_songs;
DROP POLICY IF EXISTS "Admin can manage playlist songs" ON playlist_songs;
DROP POLICY IF EXISTS "Users can insert their own play logs" ON play_logs;
DROP POLICY IF EXISTS "Users can view their own play logs" ON play_logs;
DROP POLICY IF EXISTS "Admin can view all play logs" ON play_logs;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON user_favorites;

-- ===========================================
-- 1. RLSを有効化
-- ===========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE play_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 2. Profiles ポリシー
-- ===========================================

-- ユーザーは自分のプロフィールを閲覧可能
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを更新可能
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 管理者は全プロフィールを閲覧可能
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===========================================
-- 3. Songs ポリシー
-- ===========================================

-- 認証済みユーザーはアクティブな曲を閲覧可能
CREATE POLICY "Authenticated users can view active songs"
  ON songs FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- 管理者は全曲を管理可能
CREATE POLICY "Admin can manage all songs"
  ON songs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===========================================
-- 4. Playlists ポリシー
-- ===========================================

-- 公開プレイリストは認証済みユーザーが閲覧可能
CREATE POLICY "Authenticated users can view public playlists"
  ON playlists FOR SELECT
  TO authenticated
  USING (is_public = TRUE);

-- 匿名ユーザーも公開プレイリストを閲覧可能（ホーム画面表示用）
CREATE POLICY "Anonymous can view public playlists"
  ON playlists FOR SELECT
  TO anon
  USING (is_public = TRUE);

-- 管理者は全プレイリストを管理可能
CREATE POLICY "Admin can manage all playlists"
  ON playlists FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===========================================
-- 5. Playlist Songs ポリシー
-- ===========================================

-- 公開プレイリストの曲は認証済みユーザーが閲覧可能
CREATE POLICY "Authenticated users can view public playlist songs"
  ON playlist_songs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists WHERE id = playlist_id AND is_public = TRUE
    )
  );

-- 匿名ユーザーも公開プレイリストの曲を閲覧可能
CREATE POLICY "Anonymous can view public playlist songs"
  ON playlist_songs FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM playlists WHERE id = playlist_id AND is_public = TRUE
    )
  );

-- 管理者は全playlist_songsを管理可能
CREATE POLICY "Admin can manage playlist songs"
  ON playlist_songs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===========================================
-- 6. Play Logs ポリシー
-- ===========================================

-- ユーザーは自分のプレイログを追加可能
CREATE POLICY "Users can insert their own play logs"
  ON play_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のプレイログを閲覧可能
CREATE POLICY "Users can view their own play logs"
  ON play_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 管理者は全プレイログを閲覧可能
CREATE POLICY "Admin can view all play logs"
  ON play_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- ===========================================
-- 7. User Favorites ポリシー
-- ===========================================

-- ユーザーは自分のお気に入りを管理可能
CREATE POLICY "Users can manage their own favorites"
  ON user_favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ===========================================
-- 8. Storage ポリシー（既に設定済みなら不要）
-- ===========================================

-- music バケットは認証済みユーザーのみ読み取り可能
-- covers バケットは公開

-- ===========================================
-- 完了メッセージ
-- ===========================================
-- このスクリプトを実行後、以下を確認してください：
-- 1. 匿名ユーザーでホーム画面にプレイリストが表示される
-- 2. ログインユーザーで楽曲が再生できる
-- 3. 管理者で管理画面にアクセスできる
