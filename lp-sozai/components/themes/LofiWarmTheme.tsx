import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Coffee, BookOpen, PenTool } from 'lucide-react';

const LofiWarmTheme: React.FC = () => {
  return (
    <div className="font-hand text-amber-900 bg-bgM min-h-screen text-xl leading-relaxed">
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-40 pointer-events-none mix-blend-multiply" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'}}></div>

      {/* Header */}
      <header className="py-8 text-center relative z-10">
        <div className="inline-block border-b-2 border-amber-900/20 pb-2">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                <Coffee size={32} />
                {SERVICE_NAME}
            </h1>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
                <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-lg transform -rotate-1 inline-block border border-amber-200 shadow-sm">
                    Today's Mood: Relaxed
                </span>
                <h2 className="text-6xl md:text-7xl font-bold text-amber-950 leading-none">
                    Slow Down.<br/>
                    Focus Better.
                </h2>
                <p className="text-2xl text-amber-800/80 font-sans font-light">
                    {SUB_TAGLINE}
                </p>
                <button className="mt-8 bg-primaryM text-white text-2xl px-8 py-3 rounded-xl shadow-[4px_4px_0px_#d97706] hover:translate-y-1 hover:shadow-[2px_2px_0px_#d97706] transition-all flex items-center gap-2">
                    <BookOpen size={24} /> Start Listening
                </button>
            </div>
            <div className="flex-1 relative">
                 <div className="relative z-10 transform rotate-2 border-8 border-white shadow-xl rounded-sm overflow-hidden bg-white p-2 pb-12">
                     <img src="https://picsum.photos/id/113/600/600" className="w-full h-full object-cover grayscale sepia-[0.5]" alt="Coffee Shop" />
                     <div className="absolute bottom-4 right-6 text-gray-400 font-sans text-xs">Dec 12, 2024</div>
                 </div>
                 {/* Tape */}
                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-sm shadow-sm rotate-1 z-20"></div>
            </div>
        </div>
      </section>

      {/* Features as Journal Entries */}
      <section className="py-24 px-6 relative z-10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
              {FEATURES.map((feature, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-lg shadow-md border border-amber-100 relative group hover:-translate-y-2 transition-transform">
                      <div className="absolute -top-3 -left-3 text-secondaryM">
                          <GetIcon name={feature.icon} className="w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 mt-2 text-primaryM">{feature.title}</h3>
                      <p className="text-amber-800 font-sans text-base leading-relaxed">{feature.description}</p>
                      <div className="absolute bottom-4 right-4 text-amber-200">
                          <PenTool size={16} />
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* Pricing Menu Style */}
      <section className="py-20 px-6 relative z-10">
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm p-12 shadow-xl rounded-sm border-2 border-amber-900/10">
              <h2 className="text-5xl text-center mb-12 underline decoration-wavy decoration-secondaryM/30">Menu</h2>
              
              <div className="space-y-8">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className="flex justify-between items-baseline border-b-2 border-dotted border-amber-200 pb-2 hover:bg-amber-50/50 transition-colors px-2 rounded">
                          <div>
                              <h3 className="text-2xl font-bold flex items-center gap-2">
                                  {plan.name}
                                  {plan.recommended && <span className="text-xs bg-secondaryM text-white px-2 py-0.5 rounded-full font-sans">Chef's Choice</span>}
                              </h3>
                              <span className="text-base text-amber-700/60 font-sans">{plan.features.slice(0, 2).join(', ')}</span>
                          </div>
                          <div className="text-3xl font-bold text-primaryM">
                              ¥{plan.price}
                          </div>
                      </div>
                  ))}
              </div>
              
              <div className="mt-16 text-center">
                  <p className="mb-4 text-amber-800">Ready to order?</p>
                  <button className="border-2 border-primaryM text-primaryM text-xl px-12 py-2 rounded-full hover:bg-primaryM hover:text-white transition-colors">
                      Select Plan
                  </button>
              </div>
          </div>
      </section>

      <footer className="py-12 text-center text-amber-800/50 font-sans text-sm relative z-10">
          <p>Handcrafted music for your space.</p>
          <p className="mt-2">© {SERVICE_NAME} Co.</p>
      </footer>
    </div>
  );
};

export default LofiWarmTheme;