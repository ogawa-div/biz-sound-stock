/**
 * 重複曲削除スクリプト
 * 同じタイトルの曲が複数ある場合、古い方を削除します
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log("🔍 重複曲を検索中...\n");

  // 全曲を取得
  const { data: songs, error } = await supabase
    .from("songs")
    .select("id, title, created_at")
    .order("title")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ エラー:", error.message);
    return;
  }

  // タイトルごとにグループ化
  const grouped: Record<string, typeof songs> = {};
  for (const song of songs!) {
    if (!grouped[song.title]) {
      grouped[song.title] = [];
    }
    grouped[song.title].push(song);
  }

  // 重複を検出
  const duplicateIds: string[] = [];
  for (const [title, items] of Object.entries(grouped)) {
    if (items.length > 1) {
      // 最新を残し、古いものを削除対象に
      const toDelete = items.slice(1); // 最初の1つ（最新）以外
      duplicateIds.push(...toDelete.map((s) => s.id));
      console.log(`📋 "${title}" - ${items.length}件 → ${items.length - 1}件削除`);
    }
  }

  if (duplicateIds.length === 0) {
    console.log("\n✅ 重複はありませんでした");
    return;
  }

  console.log(`\n🗑️ ${duplicateIds.length}件の重複を削除中...`);

  // 削除実行
  const { error: deleteError } = await supabase
    .from("songs")
    .delete()
    .in("id", duplicateIds);

  if (deleteError) {
    console.error("❌ 削除エラー:", deleteError.message);
    return;
  }

  console.log(`\n✅ 削除完了！ ${duplicateIds.length}件の重複を削除しました`);

  // 最終件数を確認
  const { count } = await supabase
    .from("songs")
    .select("*", { count: "exact", head: true });

  console.log(`📊 現在の曲数: ${count}件`);
}

main().catch(console.error);
