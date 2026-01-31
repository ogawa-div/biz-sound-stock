/**
 * 楽曲メタデータ修正スクリプト
 * 
 * ID3タグから取得された不正なタイトル/アーティストを
 * ファイル名ベースのタイトルと「BizSound Stock」アーティストに修正
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * file_keyからタイトルを抽出
 * 例: "songs/aftercare-line-1769780881887.mp3" → "Aftercare Line"
 */
function extractTitleFromFileKey(fileKey: string): string {
  // "songs/" プレフィックスを削除
  let name = fileKey.replace(/^songs\//, "");
  
  // 拡張子を削除
  name = name.replace(/\.mp3$/i, "");
  
  // タイムスタンプを削除 (末尾の -数字13桁)
  name = name.replace(/-\d{13}$/, "");
  
  // ハイフンをスペースに変換し、各単語の先頭を大文字に
  const title = name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  return title;
}

async function main() {
  console.log("🔧 楽曲メタデータ修正スクリプト");
  console.log("================================\n");

  // アーティストが「lowgwsi」の曲を取得（今回アップロードした曲）
  const { data: songs, error } = await supabase
    .from("songs")
    .select("id, title, artist, file_key")
    .eq("artist", "lowgwsi");

  if (error) {
    console.error("❌ 曲の取得に失敗:", error.message);
    return;
  }

  if (!songs || songs.length === 0) {
    console.log("✅ 修正が必要な曲はありません");
    return;
  }

  console.log(`📋 修正対象: ${songs.length} 曲\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const song of songs) {
    const newTitle = extractTitleFromFileKey(song.file_key);
    const newArtist = "BizSound Stock";

    console.log(`[${successCount + errorCount + 1}/${songs.length}]`);
    console.log(`   旧: "${song.title}" / ${song.artist}`);
    console.log(`   新: "${newTitle}" / ${newArtist}`);

    const { error: updateError } = await supabase
      .from("songs")
      .update({
        title: newTitle,
        artist: newArtist,
      })
      .eq("id", song.id);

    if (updateError) {
      console.log(`   ❌ 更新失敗: ${updateError.message}\n`);
      errorCount++;
    } else {
      console.log(`   ✅ 更新完了\n`);
      successCount++;
    }
  }

  console.log("================================");
  console.log(`🎉 修正完了!`);
  console.log(`   ✅ 成功: ${successCount} 件`);
  console.log(`   ❌ 失敗: ${errorCount} 件`);
  console.log("================================");
}

main().catch(console.error);
