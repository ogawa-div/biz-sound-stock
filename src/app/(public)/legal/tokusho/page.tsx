import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Music } from "lucide-react"

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | BizSound Stock",
  description: "BizSound Stockの特定商取引法に基づく表記",
}

export default function TokushoPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-slate-100">特定商取引法に基づく表記</h1>
        
        <div className="space-y-8">
          {/* 事業者名称 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">事業者名称</h2>
            <p className="text-slate-300">小川　洋</p>
          </section>

          {/* 代表者氏名 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">代表者氏名</h2>
            <p className="text-slate-300">小川　洋</p>
          </section>

          {/* 所在地 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">所在地</h2>
            <p className="text-slate-300">お客様からのご請求があり次第、遅滞なく開示いたします。</p>
          </section>

          {/* 電話番号 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">電話番号</h2>
            <p className="text-slate-300">お客様からのご請求があり次第、遅滞なく開示いたします。</p>
          </section>

          {/* メールアドレス */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">メールアドレス</h2>
            <p className="text-slate-300">
              <a href="mailto:changu724@gmail.com" className="text-amber-400 hover:underline">
                changu724@gmail.com
              </a>
            </p>
          </section>

          {/* 販売価格 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">販売価格</h2>
            <p className="text-slate-300">月額プラン：980円（税込）</p>
            <p className="text-slate-400 text-sm mt-2">
              ※詳細はサービスサイト内の
              <Link href="/pricing" className="text-amber-400 hover:underline">
                料金ページ
              </Link>
              をご参照ください。
            </p>
          </section>

          {/* 商品代金以外の必要料金 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">商品代金以外の必要料金</h2>
            <p className="text-slate-300">
              サイトの閲覧、コンテンツのダウンロード、お問い合わせ等の際の電子通信回線利用料。
            </p>
          </section>

          {/* お支払い方法 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">お支払い方法</h2>
            <p className="text-slate-300">クレジットカード決済（Stripe）</p>
          </section>

          {/* お支払い時期 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">お支払い時期</h2>
            <ul className="text-slate-300 space-y-1">
              <li>初回：お申し込み時</li>
              <li>2回目以降：初回お申し込み日を基準として、毎月同日にご請求となります。</li>
            </ul>
          </section>

          {/* 商品の引渡時期 */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-2">商品の引渡時期（役務の提供時期）</h2>
            <p className="text-slate-300">クレジットカード決済完了後、直ちにご利用いただけます。</p>
          </section>

          {/* 返品・交換・キャンセル */}
          <section className="pb-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">返品・交換・キャンセル（解約）について</h2>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-medium text-slate-200 mb-2">返品・交換</h3>
                <p className="text-slate-300 text-sm">
                  デジタルコンテンツの性質上、返品・交換はお受けできません。
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-medium text-slate-200 mb-2">解約</h3>
                <p className="text-slate-300 text-sm">
                  マイページよりいつでも解約手続きを行っていただけます。
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-medium text-slate-200 mb-2">返金</h3>
                <p className="text-slate-300 text-sm">
                  月の途中で解約された場合でも、日割り計算による返金は行わず、次回更新日までサービスをご利用いただけます。
                </p>
              </div>
            </div>
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
