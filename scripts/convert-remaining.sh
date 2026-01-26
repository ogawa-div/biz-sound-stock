#!/bin/bash

# 残りのWAV → MP3 変換スクリプト（エラーハンドリング強化版）

# HomebrewのPATHを設定
if [ -f "/opt/homebrew/bin/brew" ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

SOURCE_DIR="/Users/hiroshiogawa/Downloads/Symbolic Loops"
OUTPUT_DIR="./songs-to-upload"

mkdir -p "$OUTPUT_DIR"

echo "🎵 残りのWAV → MP3 変換"
echo "========================================="

count=0
success=0
skipped=0
failed=0

# すべてのWAVファイルを処理
find "$SOURCE_DIR" -type f -iname "*.wav" | while IFS= read -r wav_file; do
  count=$((count + 1))
  
  # ファイル名を取得（拡張子なし）
  filename=$(basename "$wav_file" .wav)
  output_file="$OUTPUT_DIR/${filename}.mp3"
  
  # すでに変換済みならスキップ
  if [ -f "$output_file" ]; then
    echo "[$count] $filename - スキップ（変換済み）"
    skipped=$((skipped + 1))
    continue
  fi
  
  echo "[$count] $filename"
  echo "   変換中..."
  
  # ffmpegで変換（詳細エラー出力あり）
  if ffmpeg -i "$wav_file" -b:a 320k -y "$output_file" 2>&1 | grep -q "Error\|error"; then
    echo "   ❌ 変換失敗"
    failed=$((failed + 1))
    rm -f "$output_file" 2>/dev/null
  else
    if [ -f "$output_file" ] && [ -s "$output_file" ]; then
      echo "   ✅ 完了: $(basename "$output_file")"
      success=$((success + 1))
    else
      echo "   ❌ 出力ファイルが作成されませんでした"
      failed=$((failed + 1))
    fi
  fi
done

echo ""
echo "========================================="
echo "🎉 変換完了!"
echo "   ✅ 新規変換: $success 件"
echo "   ⏭️ スキップ: $skipped 件"
echo "   ❌ 失敗: $failed 件"
echo "========================================="
