import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { ArrowRight, Star, Heart } from 'lucide-react';

const PopTheme: React.FC = () => {
  return (
    <div className="font-sans text-slate-800 bg-bgD selection:bg-primaryD selection:text-white overflow-x-hidden">
      {/* Navbar with Floating Style */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white/90 backdrop-blur border-2 border-slate-900 rounded-full px-6 py-3 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex justify-between items-center max-w-5xl mx-auto">
        <div className="font-black text-xl tracking-tighter flex items-center gap-2">
            <span className="bg-primaryD text-white px-2 py-1 rounded-lg transform -rotate-3 block">BIZ</span>
            <span>SOUND</span>
        </div>
        <div className="hidden md:flex gap-6 font-bold text-sm">
            <a href="#" className="hover:text-primaryD hover:underline decoration-wavy">FEATURES</a>
            <a href="#" className="hover:text-primaryD hover:underline decoration-wavy">PRICING</a>
        </div>
        <button className="bg-secondaryD text-slate-900 border-2 border-slate-900 font-bold px-4 py-1.5 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all text-sm">
          FREE TRIAL
        </button>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-20 right-[-10%] w-64 h-64 bg-secondaryD rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 left-[-10%] w-80 h-80 bg-primaryD rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-block bg-white border-2 border-slate-900 px-4 py-1 rounded-full font-bold text-xs mb-6 shadow-[3px_3px_0px_#000]">
                🚀 POP YOUR BUSINESS!
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-8 drop-shadow-sm">
                BGMで、<br/>
                <span className="text-primaryD inline-block transform -rotate-2 bg-white px-2 border-2 border-black shadow-[4px_4px_0px_#000]">お店をもっと</span><br/>
                楽しくする。
            </h1>
            <p className="text-lg font-bold text-slate-600 mb-10 max-w-2xl mx-auto bg-white/50 p-4 rounded-xl backdrop-blur-sm">
                {SUB_TAGLINE}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-primaryD text-white border-2 border-black px-8 py-4 rounded-xl font-black text-xl shadow-[6px_6px_0px_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2">
                    今すぐ始める <Heart fill="currentColor" />
                </button>
            </div>
        </div>
      </section>

      {/* Marqueeish Banner */}
      <div className="bg-slate-900 text-white py-4 overflow-hidden transform -rotate-1 border-y-4 border-black">
        <div className="flex gap-12 font-black text-2xl uppercase tracking-widest whitespace-nowrap animate-marquee justify-center">
            <span>No Copyright Claims</span>
            <span className="text-secondaryD">★</span>
            <span>Unlimited Streaming</span>
            <span className="text-secondaryD">★</span>
            <span>AI Curation</span>
            <span className="text-secondaryD">★</span>
            <span>Low Cost</span>
        </div>
      </div>

      {/* Features Cards */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 relative inline-block left-1/2 transform -translate-x-1/2">
             WHY US?
             <svg className="absolute w-full h-4 -bottom-2 text-secondaryD" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
             </svg>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
                <div key={idx} className="bg-white border-4 border-slate-900 rounded-3xl p-8 shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:translate-y-1 transition-all">
                    <div className="w-16 h-16 bg-secondaryD rounded-2xl border-2 border-black flex items-center justify-center mb-6 transform -rotate-3">
                        <GetIcon name={feature.icon} className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-black mb-4">{feature.title}</h3>
                    <p className="font-bold text-slate-500">{feature.description}</p>
                </div>
            ))}
          </div>
      </section>

      {/* Pricing - Ticket Style */}
      <section className="py-24 px-6 bg-primaryD/10 border-t-4 border-slate-900 border-dashed">
          <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-black text-center mb-16 text-slate-900">CHOOSE YOUR TICKET</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {PLANS.map((plan, idx) => (
                    <div key={idx} className={`relative bg-white border-4 border-black p-6 ${plan.recommended ? 'scale-105 z-10' : ''} rounded-xl`}>
                        {/* Cutout circles for ticket effect */}
                        <div className="absolute top-1/2 -left-4 w-8 h-8 bg-primaryD/10 rounded-full border-r-4 border-black"></div>
                        <div className="absolute top-1/2 -right-4 w-8 h-8 bg-primaryD/10 rounded-full border-l-4 border-black"></div>
                        
                        {plan.recommended && (
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-secondaryD text-black border-2 border-black px-4 py-1 rounded-full font-black text-sm animate-bounce">
                                BEST VALUE!
                            </div>
                        )}
                        
                        <div className="text-center border-b-2 border-dashed border-slate-300 pb-6 mb-6">
                            <h3 className="font-black text-xl mb-2">{plan.name}</h3>
                            <div className="text-4xl font-black text-primaryD">¥{plan.price}</div>
                        </div>
                        
                        <ul className="space-y-3 mb-8 font-bold text-sm text-slate-600">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="text-green-500">✔</span> {f}
                                </li>
                            ))}
                        </ul>
                        
                        <button className="w-full bg-slate-900 text-white font-black py-3 rounded-lg border-2 border-transparent hover:bg-white hover:text-slate-900 hover:border-black transition-colors">
                            GET TICKET
                        </button>
                    </div>
                ))}
              </div>
          </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 text-center font-bold">
         <div className="text-secondaryD text-2xl mb-4 italic font-black">BIZSOUND STOCK</div>
         <p className="opacity-50 text-sm">© {new Date().getFullYear()} Playful Music for Everyone.</p>
      </footer>
    </div>
  );
};

export default PopTheme;