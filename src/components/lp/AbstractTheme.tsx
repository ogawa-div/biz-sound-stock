"use client"

import React from 'react';
import Link from 'next/link';
import { SERVICE_NAME, SUB_TAGLINE, FEATURES, PLANS, COMPARISON_OPTIONS } from '@/lib/lp-constants';
import { GetIcon } from './icons';
import { ArrowRight, Music, AlertTriangle, CheckCircle2, X } from 'lucide-react';

const AbstractTheme: React.FC = () => {
  return (
    <div 
      className="min-h-screen font-sans text-slate-900 bg-gray-100 relative" 
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply z-0" 
        style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")'}}
      ></div>

      {/* Navbar */}
      <nav className="p-8 flex justify-between items-center relative z-20">
        <Link href="/" className="text-4xl uppercase tracking-tighter transform -rotate-2 bg-slate-800 text-white px-4 py-1 hover:scale-105 transition-transform">
          {SERVICE_NAME}
        </Link>
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors"
          >
            ログイン
          </Link>
          <Link 
            href="/signup" 
            className="bg-amber-600 text-white rounded-full px-6 py-4 font-sans font-bold hover:scale-110 transition-transform shadow-lg"
          >
            14日間無料で試す
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply opacity-80 animate-pulse"></div>
            
            {/* 問題提起のキャッチコピー */}
            <div className="bg-amber-100 border-l-4 border-amber-600 p-4 mb-6 transform -rotate-1 relative z-10">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-bold text-amber-800 text-lg">
                  お店のBGM、個人のスマホで流していませんか？<br/>
                  <span className="text-base font-medium">それは規約違反のリスクがあります。</span>
                </p>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl leading-[0.9] mb-8 relative z-10 font-black uppercase">
              法的リスクゼロの<br/>
              店舗BGMを<br/>
              <span className="text-amber-600">月額980円</span>から
            </h1>
            <p className="font-sans font-bold text-slate-600 text-xl max-w-md bg-white p-4 border-2 border-black shadow-[4px_4px_0px_#000] transform rotate-1">
              {SUB_TAGLINE}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link 
                href="/signup"
                className="bg-black text-white px-10 py-4 text-xl uppercase hover:bg-slate-800 transition-colors transform -rotate-1 hover:rotate-0 inline-block text-center"
              >
                14日間無料で試してみる
              </Link>
              <Link 
                href="/"
                className="bg-white text-black border-2 border-black px-10 py-4 text-xl uppercase hover:bg-gray-100 transition-colors transform rotate-1 hover:rotate-0 inline-block text-center"
              >
                試聴する
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-5 relative">
            {/* Collage Style Image */}
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-slate-800 transform rotate-3"></div>
              <div className="absolute inset-0 bg-amber-600 transform -rotate-2 scale-95"></div>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center transform rotate-1 border-4 border-white">
                <Music className="w-32 h-32 text-slate-800 opacity-50" />
              </div>
              {/* Torn Paper Effect */}
              <div className="absolute -bottom-10 -right-10 bg-white p-4 font-sans font-bold text-sm shadow-xl transform -rotate-6 border border-gray-200">
                <p>厳選された高品質BGM</p>
                <p>24/7 ストリーミング</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - 3つの選択肢 */}
      <section className="py-32 px-6 bg-slate-800 text-white relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-6 text-center transform -rotate-1 font-black uppercase">店舗BGMの選択肢</h2>
          <p className="text-center text-slate-300 mb-16 text-lg">あなたのお店に最適な方法はどれですか？</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {COMPARISON_OPTIONS.map((option) => (
              <div key={option.id} className="relative group">
                <div className={`absolute inset-0 ${option.highlight ? 'bg-amber-600' : 'bg-slate-600'} transform translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform`}></div>
                <div className={`relative bg-white text-slate-900 p-8 border-2 ${option.highlight ? 'border-amber-600' : 'border-black'} h-full`}>
                  <div className={`text-4xl mb-4 ${option.highlight ? 'text-amber-600' : 'text-slate-400'}`}>
                    <GetIcon name={option.icon} className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl uppercase mb-4 leading-tight font-bold">{option.title}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{option.pros}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      {option.highlight ? (
                        <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${option.highlight ? 'text-amber-600 font-bold' : 'text-slate-600'}`}>
                        {option.cons}
                      </span>
                    </div>
                  </div>
                  
                  {option.highlight && (
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <span className="inline-block bg-amber-600 text-white text-xs font-bold px-3 py-1 uppercase">
                        おすすめ
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Cutout style */}
      <section className="py-32 px-6 bg-gray-100 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl mb-16 text-center transform -rotate-1 font-black uppercase text-slate-900">BizSound Stockの特徴</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {FEATURES.map((feature) => (
              <div key={feature.id} className="relative group">
                <div className="absolute inset-0 bg-amber-600 transform translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                <div className="relative bg-white text-slate-900 p-8 border-2 border-black h-full">
                  <div className="text-4xl mb-4 text-amber-600">
                    <GetIcon name={feature.icon} className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl uppercase mb-3 leading-none font-bold">{feature.title}</h3>
                  <p className="font-sans font-medium text-slate-500 leading-tight">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing - Poster Style */}
      <section className="py-32 px-6 bg-slate-800" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-4 border-black p-8 md:p-16 shadow-[20px_20px_0px_rgba(30,41,59,0.2)]">
            <h2 className="text-5xl md:text-6xl text-center mb-4 uppercase leading-none font-black text-slate-900">料金プラン</h2>
            <p className="text-center text-slate-500 mb-12">シンプルで分かりやすい料金体系</p>
            
            <div className="space-y-8">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`flex flex-col md:flex-row items-center gap-4 border-b-4 pb-6 last:border-0 ${plan.recommended ? 'border-amber-600' : 'border-black'}`}>
                  <div className={`${plan.recommended ? 'bg-amber-600' : 'bg-black'} text-white text-xl px-4 py-2 transform -rotate-2 w-full md:w-auto text-center font-bold uppercase`}>
                    {plan.name}
                    {plan.recommended && <span className="ml-2 text-xs">★ おすすめ</span>}
                  </div>
                  <div className="flex-1 font-sans font-bold text-slate-500 text-sm text-center md:text-left">
                    {plan.features.join(' / ')}
                  </div>
                  <div className="text-4xl text-amber-600 font-black">
                    ¥{plan.price}
                    {plan.price !== '0' && <span className="text-lg text-slate-500">（税込）/月</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link 
                href="/signup"
                className="inline-block bg-amber-600 text-white text-2xl px-12 py-4 hover:bg-black transition-colors shadow-[8px_8px_0px_#000] font-bold uppercase"
              >
                14日間無料で試してみる
              </Link>
              <p className="mt-4 text-sm text-slate-500">クレジットカード登録後、14日間は無料でお試しいただけます</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6 font-black uppercase transform -rotate-1 text-slate-900">
            安心・安全・低価格
          </h2>
          <p className="text-xl text-slate-600 mb-8 font-sans">
            規約違反のリスクなし。工事も不要。<br/>
            14日間の無料トライアルで、すべての機能をお試しください。
          </p>
          <Link
            href="/signup"
            className="inline-block bg-amber-600 text-white text-2xl px-12 py-4 hover:bg-slate-800 transition-colors shadow-[8px_8px_0px_#000] font-bold uppercase transform -rotate-1 hover:rotate-0"
          >
            14日間無料で試してみる
            <ArrowRight className="inline-block ml-2 w-6 h-6" />
          </Link>
        </div>
      </section>

      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl uppercase tracking-tighter font-black">
            {SERVICE_NAME}
          </div>
          <div className="font-sans text-sm text-gray-400">
            © 2026 {SERVICE_NAME}. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AbstractTheme;
