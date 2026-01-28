import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS, USE_CASES } from '../../constants';
import { GetIcon } from '../icons';
import { ArrowRight, Play } from 'lucide-react';

const ModernTheme: React.FC = () => {
  return (
    <div className="font-sans text-slate-50 bg-slate-900 selection:bg-secondaryA selection:text-white">
      {/* Header */}
      <header className="fixed w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter italic text-white">
            BIZ<span className="text-primaryA">SOUND</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-300">
            <a href="#features" className="hover:text-primaryA transition-colors">FEATURES</a>
            <a href="#pricing" className="hover:text-primaryA transition-colors">PRICING</a>
            <a href="#cases" className="hover:text-primaryA transition-colors">CASES</a>
          </nav>
          <button className="bg-primaryA hover:bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            無料トライアル
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20">
             <img src="https://picsum.photos/id/352/1920/1080" className="object-cover w-full h-full grayscale" alt="Background" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1 rounded-full border border-secondaryA/50 text-secondaryA text-xs font-bold tracking-widest mb-6">
            NEW STANDARD BGM
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            著作権フリーで、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryA to-purple-500">
              ビジネスを加速させる。
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            {SUB_TAGLINE}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
              今すぐ始める <ArrowRight size={20} />
            </button>
            <button className="bg-slate-800 text-white border border-slate-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <Play size={20} fill="currentColor" /> デモ視聴
            </button>
          </div>
        </div>
      </section>

      {/* Features - Skewed Design */}
      <section id="features" className="py-24 bg-slate-950 relative -skew-y-3 transform origin-top-left">
        <div className="skew-y-3 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">WHY BIZSOUND?</h2>
            <div className="w-20 h-1 bg-secondaryA mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-primaryA transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] group">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primaryA transition-colors">
                  <GetIcon name={feature.icon} className="w-8 h-8 text-primaryA group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="cases" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-12 text-center">SCENES</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {USE_CASES.map((uc, idx) => (
              <div key={idx} className="relative h-64 group overflow-hidden rounded-xl">
                <img src={uc.img} alt={uc.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-6">
                  <div className="text-secondaryA mb-2">{uc.icon}</div>
                  <h3 className="text-2xl font-bold">{uc.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16">PRICING</h2>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {PLANS.map((plan, idx) => (
              <div key={idx} className={`relative p-8 rounded-3xl border ${plan.recommended ? 'bg-slate-800 border-primaryA transform md:-translate-y-4' : 'bg-slate-900 border-slate-800'}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primaryA to-blue-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-sm">月額</span>
                  <span className="text-4xl font-black mx-1">{plan.price}</span>
                  <span className="text-sm">円</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 bg-primaryA rounded-full mr-3"></div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-bold transition-all ${plan.recommended ? 'bg-primaryA hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                  選択する
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-slate-800">
        © 2024 {SERVICE_NAME}. All Rights Reserved.
      </footer>
    </div>
  );
};

export default ModernTheme;