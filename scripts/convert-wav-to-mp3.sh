#!/bin/bash

# WAV → MP3 一括変換スクリプト
# 使い方: ./scripts/convert-wav-to-mp3.sh /path/to/wav/folder

# HomebrewのPATHを設定（Macの場合）
if [ -f "/opt/homebrew/bin/brew" ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [ -f "/usr/local/bin/brew" ]; then
  eval "$(/usr/local/bin/brew shellenv)"
fi

SOURCE_DIR="$1"
OUTPUT_DIR="./songs-to-upload"

# 引数チェック
if [ -z "$SOURCE_DIR" ]; then
  echo "❌ エラー: WAVファイルがあるフォルダのパスを指定してください"
  echo "使い方: ./scripts/convert-wav-to-mp3.sh /path/to/wav/folder"
  exit 1
fi

# ソースディレクトリの存在確認
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ エラー: フォルダが見つかりません: $SOURCE_DIR"
  exit 1
fi

# 出力フォルダを作成
mkdir -p "$OUTPUT_DIR"

# ffmpegの確認
if ! command -v ffmpeg &> /dev/null; then
  echo "❌ エラー: ffmpegがインストールされていません"
  echo "   brew install ffmpeg を実行してください"
  exit 1
fi

echo "🎵 WAV → MP3 一括変換"
echo "========================================="
echo "ソース: $SOURCE_DIR"
echo "出力先: $OUTPUT_DIR"
echo ""

# WAVファイルを検索
wav_files=$(find "$SOURCE_DIR" -type f -iname "*.wav" | wc -l | tr -d ' ')

if [ "$wav_files" -eq 0 ]; then
  echo "⚠️ WAVファイルが見つかりませんでした"
  exit 1
fi

echo "📂 $wav_files 件のWAVファイルを検出"
echo ""

# 変換処理
count=0
success=0
failed=0

find "$SOURCE_DIR" -type f -iname "*.wav" | while read -r wav_file; do
  count=$((count + 1))
  filename=$(basename "$wav_file" .wav)
  output_file="$OUTPUT_DIR/${filename}.mp3"
  
  echo "[$count/$wav_files] $filename"
  
  # MP3変換（320kbps 高音質）
  if ffmpeg -i "$wav_file" -b:a 320k -y "$output_file" 2>/dev/null; then
    echo "   ✅ 完了: $(basename "$output_file")"
    success=$((success + 1))
  else
    echo "   ❌ 失敗: $filename"
    failed=$((failed + 1))
  fi
  echo ""
done

echo "========================================="
echo "🎉 変換完了!"
echo "   ✅ 成功: $success 件"
echo "   ❌ 失敗: $failed 件"
echo "========================================="
echo ""
echo "📁 変換されたMP3ファイルは以下にあります:"
echo "   $OUTPUT_DIR"
