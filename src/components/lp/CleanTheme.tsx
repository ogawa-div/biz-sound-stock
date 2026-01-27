"use client"

import React from 'react';
import Link from 'next/link';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS, USE_CASES, TESTIMONIALS } from '@/lib/lp-constants';
import { GetIcon } from './icons';
import { CheckCircle2, ArrowRight, Music, Coffee, Scissors, Dumbbell } from 'lucide-react';

const CleanTheme: React.FC = () => {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen" style={{ scrollBehavior: 'smooth' }}>
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
              <Music className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">{SERVICE_NAME}</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <a href="#features" className="hover:text-cyan-600 transition-colors">機能</a>
            <a href="#pricing" className="hover:text-cyan-600 transition-colors">料金</a>
            <a href="#cases" className="hover:text-cyan-600 transition-colors">導入事例</a>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              ログイン
            </Link>
            <Link 
              href="/signup" 
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm"
            >
              無料で試す
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            店舗BGMの<br className="md:hidden"/>
            <span className="text-cyan-600">新しいスタンダード</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            {SUB_TAGLINE}<br/>
            法的な心配をゼロに。あなたのビジネスに集中できる環境を。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/signup"
              className="bg-cyan-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              14日間無料トライアル
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/"
              className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors"
            >
              今すぐ試聴する
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-cyan-600"/> クレジットカード不要
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-cyan-600"/> 即日利用開始
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-cyan-600"/> いつでもキャンセル可能
            </span>
          </div>
        </div>
        
        {/* Hero Image / Dashboard Preview */}
        <div className="mt-16 relative mx-auto max-w-5xl">
          <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-2xl overflow-hidden aspect-video relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
              <div className="text-center p-8">
                <Music className="w-24 h-24 mx-auto text-cyan-600 mb-4 opacity-50" />
                <p className="text-slate-600 font-medium">BizSound Radio - 24/7 Store Music Stream</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Logos */}
      <div className="bg-gray-50 py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
            150曲以上の高品質BGMライブラリ
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <div className="font-bold text-xl text-gray-600">カフェ</div>
            <div className="font-bold text-xl text-gray-600">美容室</div>
            <div className="font-bold text-xl text-gray-600">ジム</div>
            <div className="font-bold text-xl text-gray-600">オフィス</div>
            <div className="font-bold text-xl text-gray-600">小売店</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">BizSoundが選ばれる理由</h2>
          <p className="mt-4 text-gray-500">店舗運営の課題を解決する、シンプルで強力な機能。</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div key={feature.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-50 rounded-lg flex items-center justify-center text-cyan-600 mb-4">
                <GetIcon name={feature.icon} className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section id="cases" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">こんな店舗で活用されています</h2>
          <p className="text-center text-gray-500 mb-12">様々な業種でご利用いただいています</p>
          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((uc, idx) => {
              const IconComponent = uc.iconName === 'Coffee' ? Coffee : uc.iconName === 'Scissors' ? Scissors : Dumbbell;
              return (
                <div key={idx} className="relative h-64 group overflow-hidden rounded-xl">
                  <img 
                    src={uc.img} 
                    alt={uc.label} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
                    <div className="text-cyan-400 mb-2">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{uc.label}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">導入店舗の声</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                <p className="text-lg text-slate-300 mb-6">"{t.comment}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">料金プラン</h2>
        <p className="text-center text-gray-500 mb-16">シンプルで透明性の高い価格設定。</p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`rounded-2xl p-8 border ${
                plan.recommended 
                  ? 'border-cyan-600 ring-2 ring-cyan-600/20 bg-white shadow-xl relative' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  おすすめ
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-extrabold text-slate-900">¥{plan.price}</span>
                <span className="text-gray-500 ml-1">/ 月</span>
              </div>
              <Link
                href={plan.recommended ? "/signup" : "/"}
                className={`block w-full py-2.5 rounded-lg font-bold mb-8 transition-colors text-center ${
                  plan.recommended 
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {plan.recommended ? "14日間無料で始める" : "今すぐ試聴"}
              </Link>
              <ul className="space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <CheckCircle2 size={18} className="text-green-500 mr-2 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            今すぐBizSound Stockを始めませんか？
          </h2>
          <p className="text-xl text-cyan-50 mb-8">
            14日間の無料トライアルで、すべての機能をお試しください。
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all shadow-lg"
          >
            無料で始める
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; 2024 {SERVICE_NAME}. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-cyan-600 transition-colors">プライバシーポリシー</Link>
            <Link href="#" className="hover:text-cyan-600 transition-colors">特定商取引法に基づく表記</Link>
            <Link href="#" className="hover:text-cyan-600 transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanTheme;
