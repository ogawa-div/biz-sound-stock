import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Cpu, Wifi, Radio } from 'lucide-react';

const CyberTheme: React.FC = () => {
  return (
    <div className="font-mono text-secondaryH bg-bgH selection:bg-primaryH selection:text-white">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 border-b border-primaryH/30 bg-bgH/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <span className="animate-pulse text-primaryH">&gt;</span> {SERVICE_NAME}_
          </div>
          <button className="border border-primaryH text-primaryH px-4 py-1 hover:bg-primaryH hover:text-black transition-colors text-xs uppercase tracking-widest shadow-[0_0_10px_rgba(217,70,239,0.5)]">
            Connect
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center z-10">
        <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
                <div className="text-primaryH text-xs mb-2 tracking-[0.2em] typewriter">:: SYSTEM INITIALIZED ::</div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-none glitch-effect" data-text="FUTURE SOUND">
                    FUTURE<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryH to-secondaryH">SOUND</span>
                    <span className="text-sm align-top ml-2 text-slate-500">v2.0</span>
                </h1>
                <p className="text-slate-400 mb-8 border-l-2 border-primaryH pl-4 leading-relaxed max-w-md">
                    {SUB_TAGLINE}
                </p>
                <div className="flex gap-4">
                    <button className="bg-secondaryH text-black px-8 py-3 font-bold hover:bg-white transition-colors clip-path-polygon">
                        START TRIAL
                    </button>
                    <button className="border border-slate-600 text-slate-400 px-8 py-3 font-bold hover:border-white hover:text-white transition-colors">
                        DEMO
                    </button>
                </div>
            </div>
            <div className="order-1 md:order-2 relative">
                <div className="relative z-10 bg-slate-900 border border-secondaryH/50 p-2 rounded max-w-sm mx-auto shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    <img src="https://picsum.photos/id/532/600/600" className="w-full h-auto mix-blend-luminosity contrast-125" />
                    <div className="absolute top-4 right-4 flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-secondaryH uppercase">
                        <span>Rec</span>
                        <span>00:23:45</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Data/Features */}
      <section className="py-24 border-t border-slate-800 z-10 relative bg-bgH/80">
        <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
                {FEATURES.map((feature, idx) => (
                    <div key={idx} className="border border-slate-800 bg-slate-900/50 p-6 hover:border-primaryH transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <GetIcon name={feature.icon} className="text-slate-500 group-hover:text-primaryH transition-colors" />
                            <span className="text-[10px] text-slate-600">0{idx+1}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Pricing Terminal */}
      <section className="py-24 z-10 relative">
        <div className="max-w-4xl mx-auto px-6">
            <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-xs text-slate-400">root@bizsound-pricing:~</div>
                </div>
                <div className="p-8 font-mono text-sm">
                    <div className="mb-6 text-green-400">$ ./show_plans.sh</div>
                    
                    <div className="grid gap-4">
                        {PLANS.map((plan, idx) => (
                            <div key={idx} className={`p-4 border ${plan.recommended ? 'border-primaryH bg-primaryH/10' : 'border-slate-700 hover:border-secondaryH'} transition-all cursor-pointer`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`font-bold ${plan.recommended ? 'text-primaryH' : 'text-secondaryH'}`}>[{plan.name.toUpperCase()}]</span>
                                    <span className="text-white">¥{plan.price}<span className="text-slate-500">/mo</span></span>
                                </div>
                                <div className="text-slate-400 text-xs">
                                    {plan.features.map((f,i) => <span key={i} className="mr-3">> {f}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 text-green-400 animate-pulse">_</div>
                </div>
            </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-600 relative z-10 bg-bgH">
        Designed by Future Corp. // {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default CyberTheme;