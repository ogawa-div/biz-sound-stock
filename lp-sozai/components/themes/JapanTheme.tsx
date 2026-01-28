import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Flower, Circle } from 'lucide-react';

const JapanTheme: React.FC = () => {
  return (
    <div className="font-mincho text-slate-800 bg-bgG">
      {/* Vertical Navigation */}
      <nav className="fixed right-0 top-0 h-full w-20 bg-white/80 backdrop-blur border-l border-slate-200 hidden md:flex flex-col items-center py-10 z-50">
         <div className="flex-1 flex flex-col gap-8 writing-vertical-rl text-sm tracking-[0.5em] text-slate-500">
            <a href="#" className="hover:text-primaryG transition-colors">導入事例</a>
            <a href="#" className="hover:text-primaryG transition-colors">料金プラン</a>
            <a href="#" className="hover:text-primaryG transition-colors">サービス概要</a>
         </div>
         <div className="writing-vertical-rl font-bold text-xl text-primaryG tracking-[0.3em] mt-8 border-t pt-8 border-slate-300">
            {SERVICE_NAME}
         </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Texture simulation */}
        <div className="absolute inset-0 bg-[#fafaf9] opacity-100" style={{backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
        <div className="absolute top-10 left-10 w-32 h-32 border border-primaryG/20 rounded-full flex items-center justify-center opacity-50">
            <div className="w-24 h-24 border border-accentG/20 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center justify-center gap-12">
            <div className="flex-1 relative">
                <div className="w-64 h-96 md:w-80 md:h-[500px] overflow-hidden rounded-t-full border-4 border-white shadow-xl relative z-10 mx-auto">
                    <img src="https://picsum.photos/id/1015/600/900" alt="Japanese Landscape" className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-1000" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accentG rounded-full -z-0 opacity-80 mix-blend-multiply"></div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
                <div className="mb-6 inline-block border-b border-accentG pb-1 text-accentG text-sm font-bold tracking-widest">
                    店舗向け定額制BGM
                </div>
                <h1 className="text-4xl md:text-5xl leading-relaxed font-bold text-primaryG mb-8">
                    静寂と、<br/>
                    <span className="text-accentG">おもてなし</span>の音。
                </h1>
                <p className="text-slate-600 leading-loose mb-10 text-sm md:text-base tracking-wider">
                    {SUB_TAGLINE}
                </p>
                <button className="bg-primaryG text-white px-10 py-3 text-sm tracking-[0.2em] hover:bg-slate-800 transition-colors shadow-lg shadow-indigo-900/20">
                    詳細を見る
                </button>
            </div>
        </div>
      </section>

      {/* Features - Horizontal Scroll or Grid */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-20">
                <div className="h-px w-12 bg-slate-300"></div>
                <h2 className="text-2xl tracking-[0.3em] text-slate-800">特長</h2>
                <div className="h-px w-12 bg-slate-300"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                {FEATURES.map((feature, idx) => (
                    <div key={idx} className="text-center group">
                        <div className="w-20 h-20 mx-auto border border-slate-200 rounded-full flex items-center justify-center mb-6 group-hover:bg-primaryG group-hover:text-white transition-colors duration-500">
                            <GetIcon name={feature.icon} className="w-8 h-8 opacity-70 group-hover:opacity-100" />
                        </div>
                        <h3 className="text-lg font-bold mb-4 text-primaryG">{feature.title}</h3>
                        <p className="text-slate-500 text-sm leading-8 text-justify opacity-80">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Mood - The Japanese aesthetics */}
      <section className="bg-primaryG text-white py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/seigaiha.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <Flower className="w-12 h-12 mx-auto mb-6 opacity-80 animate-spin-slow" />
            <h2 className="text-3xl leading-normal mb-8 tracking-widest">
                和の空間に、<br/>
                ふさわしい響きを。
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80 mt-12">
                <div className="border border-white/20 p-4 aspect-square flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">旅館</div>
                <div className="border border-white/20 p-4 aspect-square flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">割烹</div>
                <div className="border border-white/20 p-4 aspect-square flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">茶室</div>
                <div className="border border-white/20 p-4 aspect-square flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">陶芸</div>
            </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 px-6 bg-bgG">
        <div className="max-w-4xl mx-auto">
             <div className="flex items-center justify-center gap-4 mb-20">
                <div className="h-px w-12 bg-slate-300"></div>
                <h2 className="text-2xl tracking-[0.3em] text-slate-800">料金</h2>
                <div className="h-px w-12 bg-slate-300"></div>
            </div>

            <div className="space-y-6">
                {PLANS.map((plan, idx) => (
                    <div key={idx} className="bg-white border-b-4 border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between hover:border-accentG transition-colors duration-300">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                            <h3 className="text-xl font-bold text-primaryG mb-1">{plan.name}</h3>
                            <div className="text-xs text-slate-400 tracking-wider">{plan.features.join(' / ')}</div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-2xl tracking-widest">
                                <span className="text-sm">月額</span> ¥{plan.price}
                            </div>
                            <button className="border border-slate-400 px-6 py-2 text-sm hover:bg-primaryG hover:text-white hover:border-transparent transition-all">
                                選択
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <footer className="bg-slate-800 text-slate-400 py-12 text-center text-xs tracking-widest">
        <p>&copy; {SERVICE_NAME} - 和の心</p>
      </footer>
    </div>
  );
};

export default JapanTheme;