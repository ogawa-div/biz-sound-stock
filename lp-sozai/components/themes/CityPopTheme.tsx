import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Disc, Play, SkipForward } from 'lucide-react';

const CityPopTheme: React.FC = () => {
  return (
    <div className="font-dot text-slate-200 bg-bgN min-h-screen relative overflow-x-hidden">
      {/* VHS Scanlines & Vignette */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]"></div>
      <div className="fixed inset-0 pointer-events-none z-40 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>

      {/* Floating Orbs/Lights */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-primaryN rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-secondaryN rounded-full blur-[120px] opacity-20"></div>

      {/* Navbar */}
      <nav className="relative z-30 px-6 py-6 flex justify-between items-center border-b border-white/10 bg-bgN/50 backdrop-blur">
          <div className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primaryN to-secondaryN drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
              {SERVICE_NAME}
          </div>
          <div className="text-xs tracking-widest text-primaryN animate-pulse">
              ● REC
          </div>
      </nav>

      {/* Hero */}
      <section className="relative z-20 pt-20 pb-32 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                  <div className="inline-block border border-secondaryN text-secondaryN px-2 py-1 text-xs mb-4 shadow-[0_0_10px_#3b82f6]">
                      STEREO SOUND
                  </div>
                  <h1 className="text-5xl md:text-7xl mb-6 leading-tight" style={{textShadow: '2px 0 #ec4899, -2px 0 #3b82f6'}}>
                      MIDNIGHT<br/>
                      CITY BGM
                  </h1>
                  <p className="text-lg text-slate-400 mb-10 leading-loose max-w-md">
                      {SUB_TAGLINE}
                  </p>
                  <div className="flex gap-4">
                      <button className="bg-white text-bgN px-8 py-3 hover:bg-primaryN hover:text-white transition-colors flex items-center gap-2">
                          <Play fill="currentColor" size={16} /> PLAY
                      </button>
                      <button className="border border-white/30 text-white px-6 py-3 hover:bg-white/10 transition-colors">
                          CATALOG
                      </button>
                  </div>
              </div>
              
              {/* Retro Anime Style Image Frame */}
              <div className="relative">
                  <div className="aspect-video bg-black border-2 border-white/20 relative overflow-hidden group shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                      <img src="https://picsum.photos/id/287/800/600" className="w-full h-full object-cover opacity-80 mix-blend-screen group-hover:scale-110 transition-transform duration-[10s]" />
                      <div className="absolute bottom-4 left-4 text-xs text-secondaryN font-mono">
                          PM 10:45:22
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-bgN via-transparent to-transparent"></div>
                  </div>
              </div>
          </div>
      </section>

      {/* Track List (Features) */}
      <section className="relative z-20 py-20 bg-black/30 backdrop-blur-sm border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-2xl text-secondaryN mb-12 flex items-center gap-2">
                  <Disc className="animate-spin-slow" /> SIDE A: FEATURES
              </h2>
              <div className="space-y-6">
                  {FEATURES.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-6 group cursor-pointer p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                          <div className="text-slate-500 font-mono text-xl">0{idx + 1}</div>
                          <div className="flex-1">
                              <h3 className="text-xl text-primaryN group-hover:text-white transition-colors mb-1">{feature.title}</h3>
                              <p className="text-sm text-slate-400">{feature.description}</p>
                          </div>
                          <div className="text-slate-600 group-hover:text-secondaryN">
                              <SkipForward />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing Cards - Retro UI */}
      <section className="relative z-20 py-24 px-6">
          <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className={`bg-bgN border-2 ${plan.recommended ? 'border-primaryN shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'border-slate-700'} p-1 relative overflow-hidden`}>
                          {/* Inner Border */}
                          <div className="border border-white/10 h-full p-6 flex flex-col">
                              {plan.recommended && (
                                  <div className="absolute top-0 right-0 bg-primaryN text-white text-[10px] px-2 py-1">
                                      BEST SELLER
                                  </div>
                              )}
                              <h3 className="text-2xl text-white mb-2">{plan.name}</h3>
                              <div className="text-4xl text-secondaryN mb-6 font-mono">¥{plan.price}</div>
                              <ul className="space-y-2 mb-8 flex-1">
                                  {plan.features.map((f, i) => (
                                      <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                                          <span className="text-primaryN">></span> {f}
                                      </li>
                                  ))}
                              </ul>
                              <button className={`w-full py-2 text-sm uppercase tracking-widest transition-colors ${plan.recommended ? 'bg-primaryN text-white hover:bg-pink-600' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
                                  Purchase
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <footer className="relative z-20 py-12 text-center text-xs text-slate-600 font-mono">
          <p className="mb-2">NOSTALGIA FOR THE FUTURE.</p>
          <p>© {new Date().getFullYear()} {SERVICE_NAME} RECORDS.</p>
      </footer>
    </div>
  );
};

export default CityPopTheme;