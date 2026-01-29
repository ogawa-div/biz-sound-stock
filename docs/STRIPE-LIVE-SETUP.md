# Stripe 本番環境（Live Mode）移行チェックリスト

Base URL: **https://bizsoundstock.com**

---

## 前提

- テストモード（`pk_test_...`, `sk_test_...`, `price_...`）で作成した商品・価格は **本番では使えません**。
- 本番運用には **Live モード** で商品・価格を再作成し、本番用 API キー・Webhook を設定する必要があります。

---

## 1. 商品の再登録（Live モード）

### 1-1. Stripe ダッシュボードで Live に切り替え

1. [Stripe Dashboard](https://dashboard.stripe.com/) にログイン
2. 画面上部の **「テストモード」** トグルを **オフ** にする（Live モードに切り替え）

### 1-2. 本番用商品・価格の作成

1. **商品** → **商品を追加**
2. 以下の2商品を作成（テストモードで作ったのと同じ構成でOK）

| 商品名 | 価格 | 課金 | メモ |
|--------|------|------|------|
| BizSound Stock Standard Plan | ¥980 | 月額 | 本番用 |
| BizSound Stock Early Bird Plan | ¥500 | 月額 | 本番用 |

3. 各商品の **価格** をクリックし、**Price ID**（`price_...` で始まる）をメモ
   - 例: `price_1ABC...`（本番用はテスト用と異なる ID になります）

### 1-3. Vercel で更新する環境変数（Price ID）

| 変数名 | 説明 | 設定する値 |
|--------|------|------------|
| `STRIPE_PRICE_STANDARD` | Standard プラン（¥980）の Price ID | 本番で作成した Standard の Price ID |
| `STRIPE_PRICE_EARLY_BIRD` | Early Bird プラン（¥500）の Price ID | 本番で作成した Early Bird の Price ID |

**Vercel での操作:** プロジェクト → **Settings** → **Environment Variables** → 上記2つを **Production** で追加または上書き

---

## 2. API キーの取得と設定

### 2-1. Stripe ダッシュボードで本番用キーを取得

1. Stripe ダッシュボードで **Live モード** であることを確認
2. **開発者** → **API キー**
3. 以下をコピー（「公開可能キー」は表示のみ、「シークレットキー」は ** Reveal** で表示）

| キー | プレフィックス | 用途 |
|------|----------------|------|
| 公開可能キー | `pk_live_...` | フロント（必要に応じて） |
| シークレットキー | `sk_live_...` | サーバー（Checkout / Webhook 等） |

### 2-2. Vercel で設定する環境変数（API キー）

| 変数名 | 説明 | 設定する値 | 環境 |
|--------|------|------------|------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 公開可能キー | `pk_live_...` | Production |
| `STRIPE_SECRET_KEY` | シークレットキー | `sk_live_...` | Production（Sensitive 推奨） |

**Vercel での操作:** Settings → Environment Variables → 上記2つを **Production** で追加（既存のテスト用は上書き、または Production のみ本番キーに）

---

## 3. Webhook の設定

### 3-1. 本番用 Webhook エンドポイントの URL

アプリで使用している Webhook の URL は以下です。

```
https://bizsoundstock.com/api/stripe/webhook
```

※ パスは `/api/webhooks/stripe` ではなく **`/api/stripe/webhook`** です。

### 3-2. Stripe で Webhook を登録

1. Stripe ダッシュボードで **Live モード** をオンにした状態で
2. **開発者** → **Webhook** → **エンドポイントを追加**
3. **エンドポイント URL** に `https://bizsoundstock.com/api/stripe/webhook` を入力
4. **リスニングするイベント** で、以下を選択（アプリの Webhook ハンドラで処理しているイベント）:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. **エンドポイントを追加** をクリック
6. 作成したエンドポイントの **「署名シークレット」** の **表示** をクリックし、`whsec_...` をコピー

### 3-3. Vercel で設定する環境変数（Webhook）

| 変数名 | 説明 | 設定する値 | 環境 |
|--------|------|------------|------|
| `STRIPE_WEBHOOK_SECRET` | Webhook 署名シークレット | `whsec_...`（本番用エンドポイントのもの） | Production（Sensitive 推奨） |

**重要:** テスト用の `whsec_...` とは **別の値** です。本番用エンドポイント作成時に表示されたシークレットを設定してください。

---

## 4. 作業リスト（実施順）

| # | 作業場所 | 作業内容 |
|---|----------|----------|
| 1 | Stripe | ダッシュボードを **Live モード** に切り替え |
| 2 | Stripe | 本番用で商品2つ（Standard ¥980 / Early Bird ¥500）を作成し、Price ID をメモ |
| 3 | Stripe | **開発者** → **API キー** で `pk_live_...` と `sk_live_...` を取得 |
| 4 | Stripe | **開発者** → **Webhook** でエンドポイント `https://bizsoundstock.com/api/stripe/webhook` を追加し、`whsec_...` を取得 |
| 5 | Vercel | **Settings** → **Environment Variables** で以下を **Production** に設定:<br>• `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`<br>• `STRIPE_SECRET_KEY` = `sk_live_...`<br>• `STRIPE_PRICE_STANDARD` = 本番 Standard の Price ID<br>• `STRIPE_PRICE_EARLY_BIRD` = 本番 Early Bird の Price ID<br>• `STRIPE_WEBHOOK_SECRET` = 本番 Webhook の `whsec_...` |
| 6 | Vercel | 最新デプロイで **Redeploy**（環境変数を反映） |
| 7 | 本番 | 実際に Standard または Early Bird で 1 回決済し、リダイレクト・Webhook・サブスク状態を確認 |

---

## 5. 環境変数一覧（本番用・参照）

| 変数名 | 必須 | 説明 |
|--------|:----:|------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ○ | 本番公開可能キー `pk_live_...` |
| `STRIPE_SECRET_KEY` | ○ | 本番シークレットキー `sk_live_...` |
| `STRIPE_PRICE_STANDARD` | ○ | 本番 Standard の Price ID |
| `STRIPE_PRICE_EARLY_BIRD` | ○ | 本番 Early Bird の Price ID |
| `STRIPE_WEBHOOK_SECRET` | ○ | 本番 Webhook の署名シークレット `whsec_...` |
| `NEXT_PUBLIC_APP_URL` | ○ | `https://bizsoundstock.com`（Checkout リダイレクト用） |

---

## 6. 注意事項

- **.env.local** はローカル開発用です。本番用キーは **Vercel の Environment Variables にだけ** 設定し、`.env.local` には本番キーを入れないでください。
- 本番とテストで **Webhook の URL とシークレットが別** なので、本番用 `STRIPE_WEBHOOK_SECRET` を間違えてテスト用のままにしないでください。
- 初回の本番決済後、Stripe の Webhook ログで「成功」になっているか、および Supabase の `profiles.subscription_status` が想定どおり更新されているかを確認してください。
