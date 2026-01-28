import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Monitor, Music, Disc } from 'lucide-react';

const VaporwaveTheme: React.FC = () => {
  return (
    <div className="font-vapor text-slate-800 bg-bgP min-h-screen relative overflow-hidden italic">
      {/* Grid Floor */}
      <div className="fixed bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(transparent_0%,#f472b6_1px,transparent_1px),linear-gradient(90deg,transparent_0%,#06b6d4_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(200px)_scale(2)] opacity-30 pointer-events-none -z-10"></div>
      
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-primaryP/20 via-white to-secondaryP/20 -z-20"></div>

      {/* Header */}
      <nav className="p-6 flex justify-between items-center relative z-20">
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primaryP to-secondaryP drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
            {SERVICE_NAME}
        </div>
        <div className="text-xs tracking-[0.5em] uppercase text-slate-500 hidden md:block">
            Aesthetic Audio Systems Inc. 1995
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-6xl md:text-8xl font-bold text-slate-800 mb-6 leading-none tracking-tighter mix-blend-color-burn">
                    VIRTUAL<br/>
                    <span className="text-secondaryP drop-shadow-[4px_4px_0px_#06b6d4]">PLAZA</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-md font-sans not-italic">
                    {SUB_TAGLINE}
                </p>
                <button className="bg-black text-white px-8 py-3 rounded-none font-sans uppercase tracking-widest hover:bg-gradient-to-r hover:from-primaryP hover:to-secondaryP transition-all shadow-[8px_8px_0px_#f472b6]">
                    Start System
                </button>
            </div>
            
            <div className="flex-1 relative">
                {/* Statue / Bust */}
                <div className="relative w-64 h-80 md:w-80 md:h-96 mx-auto">
                    <img src="https://picsum.photos/id/1041/600/800" className="w-full h-full object-cover grayscale contrast-125 mask-image-gradient" style={{maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'}} />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondaryP rounded-full mix-blend-multiply opacity-50 blur-xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primaryP rounded-full mix-blend-multiply opacity-50 blur-xl"></div>
                    
                    {/* Floating Windows 95 Style Box */}
                    <div className="absolute bottom-10 -left-20 bg-gray-200 border-2 border-white border-b-gray-600 border-r-gray-600 p-2 shadow-lg w-48 font-sans not-italic text-xs hidden md:block">
                        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-1 py-0.5 mb-2 font-bold flex justify-between">
                            <span>Music.exe</span>
                            <span>x</span>
                        </div>
                        <p>Playing: MallSoft.mp3</p>
                        <div className="h-2 bg-gray-400 mt-2 relative overflow-hidden">
                             <div className="h-full w-2/3 bg-blue-800"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features - Glitchy Cards */}
      <section className="py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
              {FEATURES.map((feature, idx) => (
                  <div key={idx} className="bg-white/50 backdrop-blur border border-white p-8 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primaryP to-secondaryP transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                      <div className="mb-6 text-4xl text-slate-300 font-bold opacity-50">0{idx + 1}</div>
                      <h3 className="text-2xl font-bold mb-3 text-slate-800 italic">{feature.title}</h3>
                      <p className="font-sans not-italic text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* Pricing - Marble Columns */}
      <section className="py-24 px-6 relative z-10 bg-white/30 backdrop-blur-sm border-y border-white">
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-16 italic text-slate-800">MEMBERSHIP</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className={`bg-gradient-to-b from-gray-100 to-gray-300 p-1 pt-8 shadow-lg ${plan.recommended ? 'transform scale-105 z-10' : ''}`}>
                          <div className="bg-white p-6 h-full border border-gray-200 flex flex-col">
                              <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">{plan.name}</h3>
                              <div className="text-3xl font-sans not-italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-primaryP to-secondaryP mb-6">
                                  ¥{plan.price}
                              </div>
                              <ul className="space-y-2 mb-8 text-left font-sans not-italic text-sm text-slate-600 flex-1">
                                  {plan.features.map((f, i) => (
                                      <li key={i}>* {f}</li>
                                  ))}
                              </ul>
                              <button className="w-full bg-slate-800 text-white py-2 font-sans not-italic text-sm uppercase hover:bg-slate-700 transition-colors">
                                  Select
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <footer className="py-12 text-center text-slate-500 font-sans not-italic text-xs">
          <p className="mb-2">Ｗｅｌｃｏｍｅ　ｔｏ　ｔｈｅ　ｆｕｔｕｒｅ</p>
          <p>© {new Date().getFullYear()} {SERVICE_NAME}</p>
      </footer>
    </div>
  );
};

export default VaporwaveTheme;