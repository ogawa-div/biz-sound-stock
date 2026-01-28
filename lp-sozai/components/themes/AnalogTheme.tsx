import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { CassetteTape, Mic, Paperclip } from 'lucide-react';

const AnalogTheme: React.FC = () => {
  return (
    <div className="font-typewriter text-gray-800 bg-bgO min-h-screen">
      {/* Paper Texture */}
      <div className="fixed inset-0 opacity-50 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cardboard.png")'}}></div>
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5" style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-12">
        
        {/* Header Label */}
        <header className="mb-16 flex justify-center">
            <div className="bg-white p-4 shadow-lg border border-gray-300 transform -rotate-1 max-w-md w-full text-center relative">
                <div className="w-4 h-4 rounded-full bg-gray-200 absolute -top-2 left-1/2 transform -translate-x-1/2 shadow-inner"></div>
                <h1 className="font-bold text-4xl tracking-tighter text-black mb-1 font-retro">{SERVICE_NAME}</h1>
                <p className="text-primaryO font-bold uppercase text-xs tracking-[0.3em]">Analog Collection Vol.1</p>
            </div>
        </header>

        {/* Hero Section */}
        <section className="grid md:grid-cols-12 gap-8 mb-24">
            <div className="md:col-span-7 bg-white p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] border border-gray-300 relative">
                {/* Tape Strip */}
                <div className="absolute -top-3 left-10 w-24 h-6 bg-red-500/80 transform -rotate-2 opacity-80"></div>
                
                <h2 className="text-5xl font-bold leading-tight mb-6">
                    Handmade <br/>
                    <span className="bg-yellow-200 px-2">Atmosphere.</span>
                </h2>
                <p className="text-lg leading-relaxed mb-8 font-sans text-gray-600">
                    {SUB_TAGLINE}
                </p>
                <div className="flex gap-4">
                    <button className="bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 transition-colors">
                        START TRIAL
                    </button>
                    <button className="underline decoration-wavy decoration-primaryO underline-offset-4 px-6 py-3 font-bold hover:text-primaryO">
                        READ MORE
                    </button>
                </div>
            </div>
            
            <div className="md:col-span-5 relative">
                 <div className="bg-white p-3 pb-12 shadow-xl transform rotate-2 border border-gray-200">
                     <img src="https://picsum.photos/id/403/600/800" className="w-full h-full object-cover grayscale contrast-125" />
                     <div className="font-hand text-2xl text-center mt-4 text-gray-600">Office Vibes</div>
                 </div>
                 <div className="absolute -bottom-6 -right-6 text-primaryO opacity-80">
                     <CassetteTape size={64} />
                 </div>
            </div>
        </section>

        {/* Features - Sticky Notes */}
        <section className="mb-24">
            <div className="flex items-center gap-2 mb-8">
                <Paperclip />
                <h2 className="text-2xl font-bold uppercase border-b-2 border-black pb-1">Notes</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {FEATURES.map((feature, idx) => (
                    <div key={idx} className={`p-6 shadow-md ${idx === 0 ? 'bg-yellow-100 rotate-1' : idx === 1 ? 'bg-blue-100 -rotate-1' : 'bg-green-100 rotate-2'} transition-transform hover:scale-105 hover:z-10`}>
                        <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center mb-4 bg-white">
                            <span className="font-bold">{idx + 1}</span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 font-sans">{feature.title}</h3>
                        <p className="text-sm leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Pricing - Ledger Style */}
        <section className="bg-white border-2 border-black p-2 mb-12">
            <div className="border border-black p-6 md:p-12 outline outline-2 outline-offset-4 outline-black/10">
                <h2 className="text-center font-bold text-3xl mb-12 uppercase tracking-widest">Price List</h2>
                
                <div className="space-y-6">
                    {PLANS.map((plan, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row items-center border-b border-gray-300 pb-6 last:border-0">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <p className="text-xs text-gray-500 font-sans mt-1">{plan.features.join(' + ')}</p>
                            </div>
                            <div className="mx-4 flex-1 border-b border-dotted border-gray-400 hidden md:block relative top-2"></div>
                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                <div className="text-2xl font-bold text-primaryO">¥{plan.price}</div>
                                <button className="border-2 border-black px-4 py-1 text-sm font-bold hover:bg-black hover:text-white transition-colors uppercase">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <footer className="text-center py-12 border-t-4 border-double border-gray-300">
            <p className="font-bold text-xs uppercase tracking-widest text-gray-500">
                BizSound Stock - Est. 2024
            </p>
        </footer>
      </div>
    </div>
  );
};

export default AnalogTheme;