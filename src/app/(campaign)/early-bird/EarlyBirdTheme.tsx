"use client"

import React from 'react';
import Link from 'next/link';
import { SERVICE_NAME, SUB_TAGLINE, FEATURES, COMPARISON_OPTIONS } from '@/lib/lp-constants';
import { GetIcon } from '@/components/lp/icons';
import { ArrowRight, Music, AlertTriangle, CheckCircle2, X, Zap, Clock, Sparkles } from 'lucide-react';

const EarlyBirdTheme: React.FC = () => {
  // キャンペーン用のリンク
  const signupLink = "/signup?plan=early_bird";

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

      {/* Early Bird Banner */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white py-3 px-4 text-center relative z-30">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Zap className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm md:text-base">
            🎉 サービス開始記念 Early Bird キャンペーン実施中！
          </span>
          <span className="bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold">
            約49% OFF
          </span>
        </div>
      </div>

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
            href={signupLink}
            className="bg-red-600 text-white rounded-full px-6 py-4 font-sans font-bold hover:scale-110 transition-transform shadow-lg animate-pulse"
          >
            500円で始める
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply opacity-80 animate-pulse"></div>
            
            {/* Early Bird 特別バッジ */}
            <div className="bg-red-600 text-white p-4 mb-6 transform rotate-1 relative z-10 inline-block">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <span className="font-bold text-lg">期間限定 Early Bird 価格</span>
              </div>
            </div>
            
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
            
            <h1 className="text-5xl md:text-7xl leading-[0.9] mb-4 relative z-10 font-black uppercase">
              法的リスクゼロの<br/>
              店舗BGMを<br/>
              <span className="text-slate-400 line-through text-4xl md:text-5xl">月額980円</span><br/>
              <span className="text-red-600 animate-pulse">月額500円</span>から
            </h1>
            
            {/* ワンコインアピール */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-red-600 text-white px-4 py-2 font-bold text-xl rounded-full">
                💰 ワンコインで使い放題
              </span>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 font-bold text-sm rounded">
                約49% OFF
              </span>
            </div>
            
            <p className="font-sans font-bold text-slate-600 text-xl max-w-md bg-white p-4 border-2 border-black shadow-[4px_4px_0px_#000] transform rotate-1">
              {SUB_TAGLINE}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link 
                href={signupLink}
                className="bg-red-600 text-white px-10 py-4 text-xl uppercase hover:bg-red-700 transition-colors transform -rotate-1 hover:rotate-0 inline-block text-center shadow-[4px_4px_0px_#000] animate-pulse"
              >
                <Sparkles className="inline-block mr-2 w-6 h-6" />
                500円で今すぐ始める
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
              <div className="absolute inset-0 bg-red-600 transform -rotate-2 scale-95"></div>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center transform rotate-1 border-4 border-white">
                <Music className="w-32 h-32 text-slate-800 opacity-50" />
              </div>
              {/* Price Tag */}
              <div className="absolute -bottom-10 -right-10 bg-red-600 text-white p-6 font-sans font-bold shadow-xl transform -rotate-6 border-4 border-white">
                <p className="text-sm line-through text-red-200">通常 ¥980/月</p>
                <p className="text-3xl font-black">¥500/月</p>
                <p className="text-xs mt-1">Early Bird 限定</p>
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
                <div className={`absolute inset-0 ${option.highlight ? 'bg-red-600' : 'bg-slate-600'} transform translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform`}></div>
                <div className={`relative bg-white text-slate-900 p-8 border-2 ${option.highlight ? 'border-red-600' : 'border-black'} h-full`}>
                  <div className={`text-4xl mb-4 ${option.highlight ? 'text-red-600' : 'text-slate-400'}`}>
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
                        <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${option.highlight ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        {option.cons}
                      </span>
                    </div>
                  </div>
                  
                  {option.highlight && (
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase">
                        Early Bird 対象
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
                <div className="absolute inset-0 bg-red-600 transform translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                <div className="relative bg-white text-slate-900 p-8 border-2 border-black h-full">
                  <div className="text-4xl mb-4 text-red-600">
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


      {/* Pricing - Early Bird Special */}
      <section className="py-32 px-6 bg-slate-800" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border-4 border-red-600 p-8 md:p-16 shadow-[20px_20px_0px_rgba(220,38,38,0.3)] relative overflow-hidden">
            {/* Corner Badge */}
            <div className="absolute -top-2 -right-2 bg-red-600 text-white px-6 py-2 transform rotate-12 font-bold text-sm shadow-lg">
              期間限定
            </div>
            
            <h2 className="text-5xl md:text-6xl text-center mb-4 uppercase leading-none font-black text-slate-900">
              Early Bird<br/>
              <span className="text-red-600">限定価格</span>
            </h2>
            <p className="text-center text-slate-500 mb-12">サービス開始記念の特別価格です</p>
            
            {/* Price Comparison */}
            <div className="max-w-md mx-auto">
              {/* 通常価格（取り消し線） */}
              <div className="text-center mb-4">
                <span className="text-slate-400 text-sm">通常価格</span>
                <div className="text-3xl text-slate-400 line-through font-bold">
                  ¥980<span className="text-lg">/月</span>
                </div>
              </div>
              
              {/* 矢印 */}
              <div className="text-center text-4xl text-red-600 my-4">↓</div>
              
              {/* Early Bird 価格 */}
              <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-8 rounded-lg text-center transform -rotate-1 shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6" />
                  <span className="font-bold text-lg">Early Bird 限定価格</span>
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-7xl md:text-8xl font-black">
                  ¥500
                </div>
                <div className="text-xl">（税込）/ 月</div>
                <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                  <span className="bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm">
                    約49% OFF
                  </span>
                  <span className="bg-white/20 text-white px-4 py-1 rounded-full font-bold text-sm">
                    💰 ワンコインで使い放題
                  </span>
                </div>
              </div>
              
              {/* 機能一覧 */}
              <div className="mt-8 bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
                <p className="font-bold text-slate-800 mb-4 text-center">すべての機能が使い放題</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">全楽曲フルアクセス</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">商用利用OK（店舗BGM）</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">JASRAC申請不要</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">工事・専用機器不要</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">14日間無料トライアル</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link 
                href={signupLink}
                className="inline-block bg-red-600 text-white text-2xl px-12 py-5 hover:bg-red-700 transition-colors shadow-[8px_8px_0px_#000] font-bold uppercase animate-pulse"
              >
                <Zap className="inline-block mr-2 w-6 h-6" />
                500円で今すぐ始める
              </Link>
              <p className="mt-4 text-sm text-slate-500">クレジットカード登録後、14日間は無料でお試しいただけます</p>
              <p className="mt-2 text-xs text-red-600 font-bold">※ Early Bird 価格は予告なく終了する場合があります</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-100 text-red-800 px-6 py-3 rounded-full inline-block mb-6 font-bold">
            <Clock className="inline-block w-5 h-5 mr-2" />
            Early Bird キャンペーン実施中
          </div>
          <h2 className="text-4xl md:text-5xl mb-6 font-black uppercase transform -rotate-1 text-slate-900">
            今だけ<span className="text-red-600">約49% OFF</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 font-sans">
            規約違反のリスクなし。工事も不要。<br/>
            <span className="font-bold text-red-600">ワンコイン</span>で安心・安全な店舗BGMを始めましょう。
          </p>
          <Link
            href={signupLink}
            className="inline-block bg-red-600 text-white text-2xl px-12 py-4 hover:bg-red-700 transition-colors shadow-[8px_8px_0px_#000] font-bold uppercase transform -rotate-1 hover:rotate-0"
          >
            500円で今すぐ始める
            <ArrowRight className="inline-block ml-2 w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-slate-500">
            通常価格 ¥980/月 → <span className="font-bold text-red-600">Early Bird ¥500/月</span>
          </p>
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

export default EarlyBirdTheme;
