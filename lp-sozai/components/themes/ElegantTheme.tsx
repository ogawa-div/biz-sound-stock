import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS, USE_CASES } from '../../constants';
import { GetIcon } from '../icons';
import { ChevronDown, Star } from 'lucide-react';

const ElegantTheme: React.FC = () => {
  return (
    <div className="font-serif text-stone-800 bg-bgB">
      {/* Navigation */}
      <nav className="py-6 px-8 flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-2xl tracking-widest uppercase border-b-2 border-primaryB pb-1">
          {SERVICE_NAME}
        </div>
        <div className="hidden md:flex gap-10 text-sm tracking-widest text-stone-600">
          <a href="#" className="hover:text-primaryB transition-colors">Concept</a>
          <a href="#" className="hover:text-primaryB transition-colors">Service</a>
          <a href="#" className="hover:text-primaryB transition-colors">Plan</a>
        </div>
        <button className="bg-primaryB text-white px-6 py-2 rounded-sm text-sm tracking-wider hover:bg-stone-600 transition-colors">
          Start Free
        </button>
      </nav>

      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center bg-[#e7e5e4] overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://picsum.photos/id/225/1920/1200" alt="Atmosphere" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-stone-100/40 mix-blend-overlay"></div>
        </div>
        <div className="relative z-10 text-center max-w-3xl px-6 bg-white/70 backdrop-blur-sm p-12 rounded-sm shadow-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight text-stone-900">
            空間を彩る、<br/>
            上質な音色。
          </h1>
          <p className="text-stone-600 mb-8 font-sans text-sm md:text-base tracking-wide leading-loose">
            {SUB_TAGLINE}
          </p>
          <button className="border border-stone-800 px-10 py-3 text-stone-800 hover:bg-stone-800 hover:text-white transition-all duration-300 text-sm tracking-widest uppercase">
            View Details
          </button>
        </div>
        <div className="absolute bottom-8 animate-bounce text-stone-600">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* Philosophy / Features */}
      <section className="py-32 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-primaryB text-sm tracking-[0.2em] uppercase block mb-4">Features</span>
          <h2 className="text-3xl font-medium">選ばれる理由</h2>
        </div>

        <div className="space-y-24">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                 <div className="w-full h-64 bg-stone-200 relative overflow-hidden rounded-sm">
                    {/* Placeholder abstract images based on feature */}
                    <img 
                        src={`https://picsum.photos/seed/${feature.id}/800/600?grayscale`} 
                        className="w-full h-full object-cover mix-blend-multiply opacity-80"
                        alt={feature.title}
                    />
                 </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-stone-300 text-stone-500 mb-6">
                  <GetIcon name={feature.icon} />
                </div>
                <h3 className="text-2xl mb-4 text-stone-900">{feature.title}</h3>
                <p className="text-stone-500 font-sans leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mood/Use Cases */}
      <section className="bg-stone-800 text-stone-100 py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-stone-700 pb-8">
            <h2 className="text-3xl md:text-4xl">Perfect for your space</h2>
            <p className="font-sans text-stone-400 mt-4 md:mt-0">あらゆる空間に、最適なBGMを。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {USE_CASES.map((uc, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="overflow-hidden mb-4 relative">
                  <img src={uc.img} alt={uc.label} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h3 className="text-xl font-medium flex items-center gap-3">
                    <span className="text-primaryB">{uc.icon}</span> {uc.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl mb-16">Plan</h2>
          <div className="grid md:grid-cols-3 gap-px bg-stone-200 border border-stone-200">
            {PLANS.map((plan, idx) => (
              <div key={idx} className="bg-white p-8 hover:bg-stone-50 transition-colors flex flex-col items-center">
                <h3 className="text-lg font-bold text-stone-500 mb-4">{plan.name}</h3>
                <div className="text-3xl mb-8 font-sans">¥{plan.price}</div>
                <ul className="space-y-3 mb-8 flex-1 w-full font-sans text-sm text-stone-600">
                    {plan.features.map((f,i) => (
                        <li key={i} className="border-b border-dashed border-stone-200 pb-2">{f}</li>
                    ))}
                </ul>
                <button className="w-full border border-stone-300 py-2 text-sm hover:bg-stone-800 hover:text-white transition-colors">
                    SIGN UP
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-bgB py-12 text-center border-t border-stone-200 font-sans text-xs text-stone-400">
        <p>&copy; {new Date().getFullYear()} {SERVICE_NAME}. Designed for Serenity.</p>
      </footer>
    </div>
  );
};

export default ElegantTheme;