import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Gem, Star } from 'lucide-react';

const LuxuryDarkTheme: React.FC = () => {
  return (
    <div className="font-serif text-slate-200 bg-bgE selection:bg-primaryE selection:text-black">
      {/* Elegant Top Bar */}
      <header className="fixed w-full z-50 bg-bgE/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="text-xl tracking-[0.3em] font-light text-primaryE uppercase">
                {SERVICE_NAME}
            </div>
            <nav className="hidden md:flex gap-12 text-xs tracking-[0.2em] font-sans text-slate-400">
                <a href="#" className="hover:text-primaryE transition-colors">PHILOSOPHY</a>
                <a href="#" className="hover:text-primaryE transition-colors">COLLECTION</a>
                <a href="#" className="hover:text-primaryE transition-colors">MEMBERSHIP</a>
            </nav>
            <button className="border border-primaryE/50 text-primaryE px-8 py-2 text-xs tracking-widest hover:bg-primaryE hover:text-black transition-all duration-500">
                INQUIRE
            </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surfaceE via-bgE to-black opacity-90"></div>
             {/* Abstract light rays */}
             <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
             <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
            <div className="mb-8 flex justify-center">
                <Gem className="text-primaryE w-8 h-8 opacity-80" strokeWidth={1} />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                Soundscape for<br/>
                <span className="italic font-serif text-primaryE">Sophistication</span>
            </h1>
            <p className="text-slate-400 font-sans tracking-wider text-sm md:text-base mb-12 max-w-xl mx-auto leading-loose">
                {SUB_TAGLINE}
            </p>
            <button className="bg-gradient-to-r from-primaryE to-yellow-600 text-black px-10 py-4 text-sm tracking-[0.2em] font-bold hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all duration-500">
                EXPERIENCE
            </button>
        </div>
      </section>

      {/* Features - Minimal Grid */}
      <section className="py-32 bg-bgE">
        <div className="max-w-6xl mx-auto px-8">
            <div className="grid md:grid-cols-3 gap-px bg-gradient-to-r from-transparent via-white/10 to-transparent">
                {FEATURES.map((feature, idx) => (
                    <div key={idx} className="bg-bgE p-12 hover:bg-surfaceE transition-colors duration-500 group border-r border-white/5 last:border-r-0">
                        <div className="mb-8 text-primaryE opacity-50 group-hover:opacity-100 transition-opacity">
                            <GetIcon name={feature.icon} className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-light mb-4 tracking-wide text-white">{feature.title}</h3>
                        <p className="text-slate-500 font-sans text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Image Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 h-64 md:h-96">
        <div className="relative group overflow-hidden">
            <img src="https://picsum.photos/id/431/800/1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="relative group overflow-hidden">
            <img src="https://picsum.photos/id/366/800/1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="relative group overflow-hidden">
            <img src="https://picsum.photos/id/338/800/1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors"></div>
        </div>
        <div className="relative group overflow-hidden">
            <img src="https://picsum.photos/id/203/800/1200" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors"></div>
        </div>
      </section>

      {/* Pricing - Gold Accents */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-3xl font-light tracking-[0.2em] mb-20 text-primaryE">MEMBERSHIP</h2>
            <div className="space-y-4">
                {PLANS.map((plan, idx) => (
                    <div key={idx} className={`flex flex-col md:flex-row items-center justify-between p-8 border border-white/10 ${plan.recommended ? 'bg-gradient-to-r from-surfaceE to-transparent border-primaryE/30' : 'bg-transparent'} hover:border-primaryE/50 transition-colors`}>
                         <div className="mb-4 md:mb-0">
                             <div className="flex items-center gap-3">
                                <h3 className="text-xl tracking-wide">{plan.name}</h3>
                                {plan.recommended && <span className="text-[10px] border border-primaryE text-primaryE px-2 py-0.5 tracking-widest uppercase">Recommended</span>}
                             </div>
                             <ul className="flex gap-4 mt-2 text-xs text-slate-500 font-sans">
                                {plan.features.slice(0,3).map((f, i) => <li key={i}>• {f}</li>)}
                             </ul>
                         </div>
                         <div className="flex items-center gap-8">
                             <div className="text-2xl font-light">¥{plan.price}</div>
                             <button className="bg-white text-black px-6 py-2 text-xs tracking-widest font-bold hover:bg-primaryE transition-colors">
                                 SELECT
                             </button>
                         </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center">
          <p className="text-xs tracking-[0.3em] text-slate-600 uppercase">
              {SERVICE_NAME} &copy; Exclusive Audio Collection
          </p>
      </footer>
    </div>
  );
};

export default LuxuryDarkTheme;