# 🔧 BizSound Stock - 環境構築ガイド

## 前提条件

- Node.js 18+
- npm または yarn
- Supabase アカウント
- Cloudflare アカウント（R2用）

---

## 1. ローカル開発環境

### 1.1 リポジトリクローン & 依存関係インストール

```bash
cd store-bgm-app
npm install
```

### 1.2 環境変数ファイル作成

```bash
touch .env.local
```

`.env.local` に以下を記入：

```env
# ================================
# Supabase
# ================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx

# ================================
# Cloudflare R2
# ================================
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=store-bgm-music
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxx.r2.dev

# ================================
# Stripe (Phase 2で設定)
# ================================
# STRIPE_SECRET_KEY=sk_test_xxxx
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxx
```

---

## 2. Supabase セットアップ

### 2.1 プロジェクト作成

1. [supabase.com](https://supabase.com) にログイン
2. 「New Project」をクリック
3. プロジェクト名: `bizmusic` (任意)
4. リージョン: `Northeast Asia (Tokyo)` 推奨
5. パスワードを設定して作成

### 2.2 API キー取得

1. 左メニュー「Settings」→「API」
2. 以下をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.3 スキーマ適用

1. 左メニュー「SQL Editor」
2. 「New Query」をクリック
3. `supabase/schema.sql` の内容をペースト
4. 「Run」で実行

### 2.4 確認

1. 左メニュー「Table Editor」
2. 以下のテーブルが作成されていることを確認：
   - profiles
   - songs
   - playlists
   - playlist_songs
   - play_logs
   - user_favorites

---

## 3. Cloudflare R2 セットアップ

### 3.1 R2 有効化

1. [Cloudflare Dashboard](https://dash.cloudflare.com) にログイン
2. 左メニュー「R2」
3. 「Create bucket」をクリック
4. バケット名: `store-bgm-music`

### 3.2 API トークン作成

1. 「R2」→「Manage R2 API Tokens」
2. 「Create API token」
3. 権限: **Object Read & Write**
4. 以下をコピー：
   - **Account ID** → `R2_ACCOUNT_ID`
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY`

### 3.3 公開アクセス設定（オプション）

音声ファイルを直接再生するには公開設定が必要：

1. バケット設定 →「Settings」
2. 「Public access」→「Allow Access」
3. カスタムドメインまたはR2.devサブドメインをコピー
   → `NEXT_PUBLIC_R2_PUBLIC_URL`

### 3.4 CORS 設定

R2 バケットの「Settings」→「CORS」に以下を追加：

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 4. 開発サーバー起動

```bash
npm run dev
```

アクセス：
- ユーザー画面: http://localhost:3000
- 管理画面: http://localhost:3000/admin

---

## 5. 動作確認チェックリスト

### 基本確認
- [ ] ホーム画面が表示される
- [ ] サイドバーのメニューが動作する
- [ ] プレイヤーが表示される

### Supabase 接続確認
- [ ] New Releases セクションが表示される（データがあれば）
- [ ] 管理画面でプレイリスト一覧が取得できる

### R2 接続確認（管理画面から）
- [ ] 楽曲アップロードが成功する
- [ ] アップロードした曲が再生できる

---

## 6. トラブルシューティング

### Supabase 接続エラー

```
Error: Invalid API key
```

**対処**: `.env.local` の `NEXT_PUBLIC_SUPABASE_ANON_KEY` を確認

### R2 アップロードエラー

```
Error: AccessDenied
```

**対処**: R2 API トークンの権限を確認（Object Read & Write）

### 404 エラー（ページが表示されない）

```
GET / 404
```

**対処**: 
1. `.next` フォルダを削除
2. `npm run dev` で再起動

```bash
rm -rf .next && npm run dev
```

---

## 7. 本番デプロイ（Vercel）

### 7.1 Vercel プロジェクト作成

```bash
npm i -g vercel
vercel
```

### 7.2 環境変数設定

Vercel Dashboard →「Settings」→「Environment Variables」に全ての環境変数を追加

### 7.3 デプロイ

```bash
vercel --prod
```

---

## 参考リンク

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Stripe Docs](https://stripe.com/docs)
