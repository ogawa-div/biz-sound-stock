-- ===========================================
-- 無限再帰エラーの修正
-- Error: "infinite recursion detected in policy for relation profiles"
-- 
-- 原因: profilesテーブルのポリシー内でprofilesテーブルを参照している
-- ===========================================

-- 問題のあるポリシーを削除
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can manage all songs" ON songs;
DROP POLICY IF EXISTS "Admin can manage all playlists" ON playlists;
DROP POLICY IF EXISTS "Admin can manage playlist songs" ON playlist_songs;
DROP POLICY IF EXISTS "Admin can view all play logs" ON play_logs;

-- ===========================================
-- 修正版ポリシー: SECURITY DEFINERファンクションを使用
-- ===========================================

-- 管理者かどうかを確認する関数（SECURITY DEFINER = RLSをバイパス）
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Songs: 管理者は全曲を管理可能
CREATE POLICY "Admin can manage all songs"
  ON songs FOR ALL
  TO authenticated
  USING (is_admin());

-- Playlists: 管理者は全プレイリストを管理可能
CREATE POLICY "Admin can manage all playlists"
  ON playlists FOR ALL
  TO authenticated
  USING (is_admin());

-- Playlist Songs: 管理者は全playlist_songsを管理可能
CREATE POLICY "Admin can manage playlist songs"
  ON playlist_songs FOR ALL
  TO authenticated
  USING (is_admin());

-- Play Logs: 管理者は全プレイログを閲覧可能
CREATE POLICY "Admin can view all play logs"
  ON play_logs FOR SELECT
  TO authenticated
  USING (is_admin());

-- ===========================================
-- 確認用クエリ
-- ===========================================
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
