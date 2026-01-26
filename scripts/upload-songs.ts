/**
 * 楽曲一括アップロードスクリプト
 * 
 * 使い方:
 * 1. MP3ファイルを songs-to-upload/ フォルダに配置
 * 2. npx ts-node scripts/upload-songs.ts を実行
 * 
 * ファイル名の推奨フォーマット:
 * - "アーティスト名 - 曲名.mp3"
 * - または ID3タグにメタデータが入っていればそちらを使用
 */

// 環境変数を読み込む
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";
import { parseFile } from "music-metadata";

// ===========================================
// 設定
// ===========================================
const CONFIG = {
  // アップロード元フォルダ（プロジェクトルートからの相対パス）
  sourceFolder: "./songs-to-upload",
  
  // R2上の保存先パス
  r2Prefix: "songs/",
  
  // デフォルト値（ID3タグがない場合に使用）
  defaultGenre: "ambient" as const,
  defaultMood: "relaxing" as const,
  defaultArtist: "BizSound Stock",
};

// ===========================================
// 環境変数チェック
// ===========================================
const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "R2_ENDPOINT",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ 環境変数 ${envVar} が設定されていません`);
    process.exit(1);
  }
}

// ===========================================
// クライアント初期化
// ===========================================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// ===========================================
// ユーティリティ関数
// ===========================================

/**
 * ファイル名からタイトルとアーティストを抽出
 * フォーマット: "アーティスト - タイトル.mp3" or "タイトル.mp3"
 */
function parseFileName(fileName: string): { title: string; artist: string } {
  const nameWithoutExt = path.basename(fileName, path.extname(fileName));
  
  if (nameWithoutExt.includes(" - ")) {
    const [artist, title] = nameWithoutExt.split(" - ", 2);
    return { title: title.trim(), artist: artist.trim() };
  }
  
  return { title: nameWithoutExt, artist: CONFIG.defaultArtist };
}

/**
 * MP3ファイルのメタデータを取得
 */
async function getMP3Metadata(filePath: string): Promise<{
  title: string;
  artist: string;
  album: string | null;
  duration: number;
}> {
  try {
    const metadata = await parseFile(filePath);
    const { title, artist, album } = metadata.common;
    const duration = Math.round(metadata.format.duration || 0);
    
    // ID3タグがなければファイル名から推測
    const fromFileName = parseFileName(filePath);
    
    return {
      title: title || fromFileName.title,
      artist: artist || fromFileName.artist,
      album: album || null,
      duration,
    };
  } catch (error) {
    console.warn(`⚠️ メタデータ取得失敗: ${filePath}`, error);
    const fromFileName = parseFileName(filePath);
    return {
      ...fromFileName,
      album: null,
      duration: 0,
    };
  }
}

/**
 * ファイルをR2にアップロード
 */
async function uploadToR2(filePath: string, fileKey: string): Promise<void> {
  const fileContent = fs.readFileSync(filePath);
  
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
      Body: fileContent,
      ContentType: "audio/mpeg",
    })
  );
}

/**
 * Supabaseに楽曲情報を登録
 */
async function registerSong(songData: {
  title: string;
  artist: string;
  album: string | null;
  file_key: string;
  duration: number;
  genre: string;
  mood: string;
}): Promise<void> {
  const { error } = await supabase.from("songs").insert({
    ...songData,
    is_active: true,
    play_count: 0,
  });
  
  if (error) {
    throw new Error(`Supabase登録失敗: ${error.message}`);
  }
}

/**
 * 安全なファイルキーを生成（日本語などを除去）
 */
function generateSafeFileKey(originalName: string): string {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  
  // 英数字とハイフン、アンダースコアのみ残す
  const safeName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  
  // タイムスタンプを追加してユニークにする
  const timestamp = Date.now();
  return `${CONFIG.r2Prefix}${safeName}-${timestamp}${ext}`;
}

// ===========================================
// メイン処理
// ===========================================
async function main() {
  console.log("🎵 BizSound Stock - 楽曲一括アップロード");
  console.log("=========================================\n");
  
  // ソースフォルダの確認
  const sourcePath = path.resolve(CONFIG.sourceFolder);
  if (!fs.existsSync(sourcePath)) {
    console.log(`📁 フォルダを作成: ${sourcePath}`);
    fs.mkdirSync(sourcePath, { recursive: true });
    console.log("\n⚠️ MP3ファイルを songs-to-upload/ フォルダに配置してから再実行してください");
    return;
  }
  
  // MP3ファイル一覧を取得
  const files = fs.readdirSync(sourcePath).filter(
    (f) => f.toLowerCase().endsWith(".mp3")
  );
  
  if (files.length === 0) {
    console.log("⚠️ MP3ファイルが見つかりません");
    console.log(`   ${sourcePath} にMP3ファイルを配置してください`);
    return;
  }
  
  console.log(`📂 ${files.length} 件のMP3ファイルを検出\n`);
  
  // 処理開始
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(sourcePath, fileName);
    
    console.log(`[${i + 1}/${files.length}] ${fileName}`);
    
    try {
      // 1. メタデータ取得
      const metadata = await getMP3Metadata(filePath);
      console.log(`   📋 ${metadata.title} / ${metadata.artist} (${metadata.duration}秒)`);
      
      if (metadata.duration === 0) {
        console.log(`   ⚠️ 再生時間が取得できませんでした。スキップします。`);
        errorCount++;
        continue;
      }
      
      // 2. R2にアップロード
      const fileKey = generateSafeFileKey(fileName);
      console.log(`   ☁️ R2にアップロード中... (${fileKey})`);
      await uploadToR2(filePath, fileKey);
      
      // 3. Supabaseに登録
      console.log(`   💾 Supabaseに登録中...`);
      await registerSong({
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        file_key: fileKey,
        duration: metadata.duration,
        genre: CONFIG.defaultGenre,
        mood: CONFIG.defaultMood,
      });
      
      console.log(`   ✅ 完了\n`);
      successCount++;
      
    } catch (error) {
      console.log(`   ❌ エラー: ${error}\n`);
      errorCount++;
    }
  }
  
  // 結果サマリー
  console.log("=========================================");
  console.log(`🎉 アップロード完了!`);
  console.log(`   ✅ 成功: ${successCount} 件`);
  console.log(`   ❌ 失敗: ${errorCount} 件`);
  console.log("=========================================");
}

// 実行
main().catch(console.error);
