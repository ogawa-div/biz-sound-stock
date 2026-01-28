import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Cloud, Moon, Music, Coffee } from 'lucide-react';

const LofiTheme: React.FC = () => {
  return (
    <div className="font-pixel text-slate-200 bg-bgJ min-h-screen relative overflow-x-hidden text-lg">
      {/* Background Gradient & Grain */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 z-0"></div>
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise.png")'}}></div>
      
      {/* Floating Elements */}
      <div className="fixed top-20 right-20 text-pink-300 opacity-50 animate-pulse z-0">
          <Moon size={64} />
      </div>
      <div className="fixed bottom-40 left-10 text-purple-300 opacity-30 z-0">
          <Cloud size={120} />
      </div>

      {/* Retro Window Container */}
      <div className="relative z-10 max-w-4xl mx-auto pt-20 pb-20 px-4">
          
          {/* Main Hero Window */}
          <div className="bg-slate-900/80 backdrop-blur-sm border-2 border-pink-400 rounded-lg shadow-[4px_4px_0px_rgba(244,114,182,0.5)] mb-16 overflow-hidden">
              <div className="bg-pink-400 px-4 py-1 flex items-center justify-between border-b-2 border-pink-500">
                  <span className="text-black font-bold tracking-widest text-xl">♥ {SERVICE_NAME}.exe</span>
                  <div className="flex gap-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
                  </div>
              </div>
              <div className="p-8 md:p-12 text-center">
                  <div className="inline-block bg-purple-800 text-pink-200 px-4 py-1 rounded mb-6 text-xl">
                      Now Playing: Chill Business Vibes
                  </div>
                  <h1 className="text-5xl md:text-7xl mb-6 text-pink-100 drop-shadow-md leading-none">
                      RELAX<br/>
                      & CREATE
                  </h1>
                  <p className="text-xl md:text-2xl text-purple-200 mb-10 font-sans tracking-wide">
                      {SUB_TAGLINE}
                  </p>
                  
                  <div className="flex justify-center gap-6">
                      <button className="bg-pink-500 text-white text-2xl px-8 py-2 hover:bg-pink-400 border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all">
                          START_FREE
                      </button>
                  </div>
              </div>
          </div>

          {/* Player UI / Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-slate-800/80 border border-purple-500 p-6 rounded shadow-lg">
                   <div className="flex items-center gap-2 mb-4 text-purple-300 border-b border-purple-500/50 pb-2">
                       <Music size={24} />
                       <span className="text-2xl">Playlist.m3u</span>
                   </div>
                   <ul className="space-y-4">
                       {FEATURES.map((feature, idx) => (
                           <li key={idx} className="flex items-start gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                               <span className="text-pink-400 mt-1">▶</span>
                               <div>
                                   <div className="text-xl text-pink-100">{feature.title}</div>
                                   <div className="text-slate-400 text-base font-sans">{feature.description}</div>
                               </div>
                           </li>
                       ))}
                   </ul>
              </div>

              {/* Pricing as Cassette Tapes */}
              <div className="space-y-4">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className={`relative h-32 rounded-xl border-2 ${plan.recommended ? 'bg-pink-900/80 border-pink-300' : 'bg-slate-800/80 border-slate-600'} p-4 flex items-center justify-between group hover:scale-[1.02] transition-transform`}>
                          <div className="flex items-center gap-4">
                              <div className="w-20 h-20 bg-black/50 rounded-full border-4 border-white/10 flex items-center justify-center animate-spin-slow">
                                  <div className="w-8 h-8 bg-transparent border-2 border-white rounded-full"></div>
                              </div>
                              <div>
                                  <h3 className="text-2xl text-white">{plan.name}</h3>
                                  <div className="text-xl text-pink-300">¥{plan.price}</div>
                              </div>
                          </div>
                          <button className="text-xl border border-white/50 px-4 py-1 hover:bg-white hover:text-black transition-colors">
                              SELECT
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      <footer className="fixed bottom-0 w-full bg-slate-900/90 border-t border-purple-500/30 p-2 text-center text-purple-300 z-50 text-base">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
              <span>© {new Date().getFullYear()} {SERVICE_NAME}</span>
              <div className="flex gap-4">
                  <span>VOL: ||||||||||</span>
                  <span>BPM: 80</span>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LofiTheme;