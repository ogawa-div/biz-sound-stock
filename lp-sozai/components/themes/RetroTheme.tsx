import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Music, Coffee, Utensils } from 'lucide-react';

const RetroTheme: React.FC = () => {
  return (
    <div className="font-retro text-slate-800 bg-bgI">
      {/* Pattern Overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px'}}></div>

      {/* Header */}
      <nav className="relative z-10 py-6 px-6 flex justify-center bg-white border-b-4 border-primaryI shadow-md">
        <div className="flex items-center gap-3">
            <Music className="text-secondaryI w-8 h-8" />
            <span className="text-3xl text-primaryI drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]" style={{textShadow: '2px 2px 0 #000000'}}>
                {SERVICE_NAME}
            </span>
            <Music className="text-secondaryI w-8 h-8" />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-block bg-secondaryI text-white px-6 py-2 rounded-full text-lg mb-6 shadow-[4px_4px_0px_#000] border-2 border-black rotate-2">
                New Arrival!
            </div>
            <h1 className="text-6xl md:text-8xl text-primaryI mb-8" style={{textShadow: '4px 4px 0 #fff, 6px 6px 0 #000'}}>
                Juke Box<br/>
                for Business
            </h1>
            <p className="font-sans font-bold text-slate-700 text-lg md:text-xl mb-12 bg-white/80 inline-block px-8 py-4 rounded-xl border-2 border-slate-200">
                {SUB_TAGLINE}
            </p>
            
            <div className="flex justify-center gap-6">
                <button className="bg-primaryI text-white text-xl px-10 py-4 rounded-lg border-b-8 border-red-700 hover:border-b-0 hover:translate-y-2 transition-all shadow-xl">
                    ORDER NOW
                </button>
            </div>
        </div>
        
        {/* Decor */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-secondaryI rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primaryI rounded-full opacity-20"></div>
      </section>

      {/* Features - Checkerboard */}
      <section className="py-20 bg-white border-y-4 border-black relative">
         <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'conic-gradient(#000 90deg, transparent 0 180deg, #000 0 270deg, transparent 0)', backgroundSize: '40px 40px'}}></div>
         
         <div className="max-w-6xl mx-auto px-6 relative z-10">
             <h2 className="text-4xl text-center text-black mb-16" style={{textShadow: '2px 2px 0 #secondaryI'}}>SPECIALS</h2>
             
             <div className="grid md:grid-cols-3 gap-8">
                 {FEATURES.map((feature, idx) => (
                     <div key={idx} className="bg-bgI border-4 border-black p-8 rounded-xl shadow-[8px_8px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all">
                         <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center mb-4 mx-auto text-secondaryI">
                            <GetIcon name={feature.icon} />
                         </div>
                         <h3 className="text-2xl text-center mb-3 text-primaryI">{feature.title}</h3>
                         <p className="font-sans font-bold text-slate-600 text-center leading-relaxed">{feature.description}</p>
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* Pricing Menu */}
      <section className="py-24 px-6 bg-secondaryI/20">
          <div className="max-w-4xl mx-auto bg-white border-8 border-double border-primaryI p-8 md:p-12 shadow-2xl rotate-1">
              <h2 className="text-5xl text-center text-primaryI mb-12 underline decoration-wavy decoration-secondaryI">MENU</h2>
              
              <div className="space-y-8 font-sans font-bold">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row justify-between items-end border-b-2 border-dotted border-slate-300 pb-4">
                          <div className="mb-2 md:mb-0">
                              <h3 className="text-2xl text-black flex items-center gap-2">
                                  {plan.name}
                                  {plan.recommended && <span className="text-xs bg-secondaryI text-white px-2 py-1 rounded-full -rotate-6">RECOMMENDED</span>}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">{plan.features.join(', ')}</p>
                          </div>
                          <div className="text-3xl text-primaryI">
                              ¥{plan.price}
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-12 text-center">
                  <button className="bg-black text-white text-xl px-12 py-3 rounded-full hover:bg-secondaryI transition-colors">
                      Select Plan
                  </button>
              </div>
          </div>
      </section>

      <footer className="bg-primaryI text-white py-12 text-center">
          <div className="text-2xl mb-2">Thank you!</div>
          <p className="font-sans opacity-80 text-sm">© {SERVICE_NAME} Diner.</p>
      </footer>
    </div>
  );
};

export default RetroTheme;