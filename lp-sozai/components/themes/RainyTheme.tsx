import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { CloudRain, Moon, Umbrella } from 'lucide-react';

const RainyTheme: React.FC = () => {
  return (
    <div className="font-clean text-blue-100 bg-bgR min-h-screen relative overflow-hidden">
      {/* Rain Animation */}
      <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute top-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-30 animate-rain"
                style={{
                    left: `${Math.random() * 100}%`,
                    height: `${Math.random() * 20 + 10}%`,
                    animationDuration: `${Math.random() * 1 + 0.5}s`,
                    animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
          ))}
      </div>

      {/* Bokeh Background */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primaryR rounded-full blur-[150px] opacity-20 z-0"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-secondaryR rounded-full blur-[150px] opacity-10 z-0"></div>

      {/* Navbar */}
      <nav className="fixed w-full z-50 p-6 flex justify-between items-center bg-bgR/50 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-2 text-xl font-bold tracking-widest text-blue-200">
              <CloudRain size={20} /> {SERVICE_NAME}
          </div>
          <button className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/10 transition-colors backdrop-blur-sm">
              Start Free Trial
          </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-40 pb-24 px-6 min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-blue-900/50 text-blue-300 px-4 py-1 rounded-full text-xs font-bold mb-8 border border-blue-500/30">
                  <Moon size={12} /> Midnight Lo-Fi Collection
              </div>
              <h1 className="text-5xl md:text-7xl font-light mb-8 text-white drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                  Focus in the<br/>
                  <span className="font-bold">Rain.</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-200/70 mb-12 max-w-xl mx-auto leading-relaxed">
                  {SUB_TAGLINE}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                       <h3 className="text-xl font-bold mb-2 text-blue-100 group-hover:text-white">Rainy Cafe</h3>
                       <p className="text-sm text-blue-300/60">Jazz piano & rain sounds</p>
                   </div>
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                       <h3 className="text-xl font-bold mb-2 text-blue-100 group-hover:text-white">Midnight Study</h3>
                       <p className="text-sm text-blue-300/60">Deep focus beats</p>
                   </div>
              </div>
          </div>
      </section>

      {/* Features - Glass Cards */}
      <section className="py-24 px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
              <h2 className="text-center text-3xl font-light mb-16 text-blue-200">Features</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  {FEATURES.map((feature, idx) => (
                      <div key={idx} className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-xl">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-300">
                              <GetIcon name={feature.icon} />
                          </div>
                          <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                          <p className="text-blue-200/60 leading-relaxed text-sm">{feature.description}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing - Simple List */}
      <section className="py-24 px-6 relative z-10 bg-black/20">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-center text-3xl font-light mb-16 text-blue-200">Plans</h2>
              <div className="space-y-4">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-6 rounded-2xl border ${plan.recommended ? 'bg-blue-600/20 border-blue-500/50' : 'bg-transparent border-white/10'} backdrop-blur-sm transition-colors hover:bg-white/5`}>
                          <div>
                              <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                  {plan.name}
                                  {plan.recommended && <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">POPULAR</span>}
                              </h3>
                              <div className="text-blue-300/60 text-xs mt-1">{plan.features.join(' • ')}</div>
                          </div>
                          <div className="text-right">
                              <div className="text-2xl font-bold text-white">¥{plan.price}</div>
                              <button className="text-xs text-blue-300 hover:text-white mt-1 underline decoration-blue-500/50">
                                  Choose
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <footer className="py-12 text-center text-blue-200/40 text-xs relative z-10">
          <p>© {new Date().getFullYear()} {SERVICE_NAME}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RainyTheme;