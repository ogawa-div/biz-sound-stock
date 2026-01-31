import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Music } from "lucide-react"

export const metadata: Metadata = {
  title: "プライバシーポリシー | BizSound Stock",
  description: "BizSound Stockのプライバシーポリシー",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link href="/" className="text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500">
              <Music className="h-4 w-4 text-slate-900" />
            </div>
            <span className="text-lg font-bold text-slate-100">BizSound Stock</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold text-slate-100">プライバシーポリシー</h1>
        
        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-slate-400 mb-8">
            最終更新日: 2026年1月27日
          </p>

          <p className="text-slate-300 leading-relaxed mb-8">
            BizSound Stock（以下「当サービス」といいます）は、ユーザーの個人情報の保護を重要と考え、
            以下のとおりプライバシーポリシーを定めます。
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">1. 収集する情報</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              当サービスは、サービス提供のために以下の情報を収集します。
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>
                <strong>アカウント情報:</strong> メールアドレス、パスワード（暗号化して保存）、
                表示名、業種、店舗名
              </li>
              <li>
                <strong>利用情報:</strong> 再生履歴、お気に入り登録、アクセスログ
              </li>
              <li>
                <strong>デバイス情報:</strong> IPアドレス、ブラウザの種類、オペレーティングシステム
              </li>
            </ul>
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-slate-300 text-sm">
                <strong className="text-amber-400">決済情報について:</strong> クレジットカード情報は、
                当サービスでは保持せず、決済代行サービス「Stripe」により安全に処理されます。
                Stripeのプライバシーポリシーについては、
                <a 
                  href="https://stripe.com/jp/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline"
                >
                  こちら
                </a>
                をご確認ください。
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">2. 情報の利用目的</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              収集した情報は、以下の目的で利用します。
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>当サービスの提供、運営、維持</li>
              <li>ユーザーアカウントの管理、認証</li>
              <li>サービスに関するお知らせ、サポートの提供</li>
              <li>サービスの改善、新機能の開発</li>
              <li>利用状況の分析、統計情報の作成</li>
              <li>不正利用の防止、セキュリティの確保</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">3. 第三者への提供</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              当サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>
                サービス提供に必要な業務委託先（ホスティング、決済処理等）に対して、
                必要な範囲で提供する場合
              </li>
              <li>合併、事業譲渡等により事業が承継される場合</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">4. 情報の保護</h2>
            <p className="text-slate-300 leading-relaxed">
              当サービスは、個人情報の漏洩、滅失、毀損を防止するため、適切なセキュリティ対策を講じます。
              データは暗号化された通信（SSL/TLS）により送受信され、安全なサーバーに保管されます。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">5. Cookieの使用</h2>
            <p className="text-slate-300 leading-relaxed">
              当サービスは、ユーザー体験の向上、ログイン状態の維持、利用状況の分析のためにCookieを使用します。
              ブラウザの設定によりCookieを無効にすることができますが、一部の機能が利用できなくなる場合があります。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">6. ユーザーの権利</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              ユーザーは、以下の権利を有します。
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>自己の個人情報の開示、訂正、削除を請求する権利</li>
              <li>個人情報の利用停止を請求する権利</li>
              <li>アカウントの削除を請求する権利</li>
            </ul>
            <p className="text-slate-300 leading-relaxed mt-4">
              これらの権利行使をご希望の場合は、お問い合わせフォームよりご連絡ください。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">7. 未成年者について</h2>
            <p className="text-slate-300 leading-relaxed">
              当サービスは、原則として事業者向けのサービスです。
              18歳未満の方が利用される場合は、保護者の同意を得た上でご利用ください。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">8. ポリシーの変更</h2>
            <p className="text-slate-300 leading-relaxed">
              当サービスは、必要に応じて本ポリシーを変更することがあります。
              重要な変更がある場合は、当サービス上での通知またはメールにてお知らせします。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">9. お問い合わせ</h2>
            <p className="text-slate-300 leading-relaxed">
              本ポリシーに関するお問い合わせは、アプリ内のお問い合わせフォームまたはメールにてご連絡ください。
            </p>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ホームに戻る
          </Link>
        </div>
      </main>
    </div>
  )
}
