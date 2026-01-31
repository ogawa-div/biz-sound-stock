import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Music } from "lucide-react"

export const metadata: Metadata = {
  title: "利用規約 | BizSound Stock",
  description: "BizSound Stockの利用規約",
}

export default function TermsPage() {
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
        <h1 className="mb-8 text-3xl font-bold text-slate-100">利用規約</h1>
        
        <div className="prose prose-invert prose-slate max-w-none">
          <p className="text-slate-400 mb-8">
            最終更新日: 2026年1月27日
          </p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第1条（適用）</h2>
            <p className="text-slate-300 leading-relaxed">
              本規約は、BizSound Stock（以下「当サービス」といいます）の利用に関する条件を定めるものです。
              ユーザーは、本規約に同意の上、当サービスを利用するものとします。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第2条（サービス内容）</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              当サービスは、店舗向けの著作権フリーBGM配信サービスです。ユーザーは、本規約に従い、以下の利用が許可されます。
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>店舗、オフィス、商業施設等での楽曲の再生（商用利用）</li>
              <li>有料プランに基づく無制限のストリーミング再生</li>
              <li>お気に入り機能、プレイリスト機能の利用</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第3条（禁止事項）</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              ユーザーは、当サービスの利用にあたり、以下の行為を行ってはなりません。
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>楽曲のダウンロード、複製、再配布</li>
              <li>アカウントの第三者への譲渡、共有</li>
              <li>楽曲を映像作品、広告、放送等に使用すること</li>
              <li>サービスのリバースエンジニアリング、不正アクセス</li>
              <li>法令または公序良俗に反する行為</li>
              <li>当サービスの運営を妨げる行為</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第4条（料金・支払い）</h2>
            <p className="text-slate-300 leading-relaxed">
              有料プランの利用料金は、当サービスが定める金額とし、ユーザーは所定の方法により支払うものとします。
              支払いはStripe社の決済システムを通じて処理されます。
              サブスクリプションは自動更新され、キャンセルするまで継続されます。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第5条（著作権）</h2>
            <p className="text-slate-300 leading-relaxed">
              当サービスで提供される楽曲の著作権は、当サービスまたはライセンサーに帰属します。
              ユーザーには、本規約に定める範囲内での利用権のみが付与され、著作権その他の権利の移転は行われません。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第6条（免責事項）</h2>
            <p className="text-slate-300 leading-relaxed">
              当サービスは、楽曲の内容、品質、特定目的への適合性について保証するものではありません。
              当サービスの利用により生じた損害について、当社は一切の責任を負わないものとします。
              ただし、当社に故意または重大な過失がある場合はこの限りではありません。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第7条（サービスの変更・終了）</h2>
            <p className="text-slate-300 leading-relaxed">
              当社は、事前の通知なく、当サービスの内容を変更、または提供を終了することができるものとします。
              サービス終了の場合、当社はユーザーに対し、合理的な期間をもって事前に通知するよう努めます。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第8条（規約の変更）</h2>
            <p className="text-slate-300 leading-relaxed">
              当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができるものとします。
              変更後の規約は、当サービス上に表示した時点より効力を生じるものとします。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">第9条（準拠法・管轄）</h2>
            <p className="text-slate-300 leading-relaxed">
              本規約の解釈にあたっては、日本法を準拠法とします。
              当サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">お問い合わせ</h2>
            <p className="text-slate-300 leading-relaxed">
              本規約に関するお問い合わせは、アプリ内のお問い合わせフォームまたはメールにてご連絡ください。
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
