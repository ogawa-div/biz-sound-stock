import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { ArrowUpRight } from 'lucide-react';

const BoldTheme: React.FC = () => {
  return (
    <div className="font-bold text-black bg-white selection:bg-black selection:text-primaryL">
      {/* Marquee Header */}
      <div className="bg-primaryL overflow-hidden py-2 border-b-4 border-black">
        <div className="animate-marquee whitespace-nowrap font-bold uppercase tracking-widest text-sm">
            NO COPYRIGHT CLAIMS /// UNLIMITED BGM /// START TODAY /// NO COPYRIGHT CLAIMS /// UNLIMITED BGM /// START TODAY ///
        </div>
      </div>

      <nav className="flex justify-between items-center p-6 border-b-4 border-black">
          <div className="text-4xl font-black uppercase tracking-tighter">
              {SERVICE_NAME}
          </div>
          <button className="bg-black text-white px-8 py-3 font-bold uppercase hover:bg-primaryL hover:text-black transition-colors border-2 border-transparent hover:border-black">
              Menu
          </button>
      </nav>

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[80vh] border-b-4 border-black">
          <div className="p-8 md:p-16 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-black bg-white">
              <h1 className="text-7xl md:text-9xl font-black leading-[0.85] mb-8 uppercase break-words">
                  NO<br/>MORE<br/><span className="text-primaryL bg-black px-2">SILENCE</span>
              </h1>
              <p className="text-xl font-medium mb-12 max-w-md border-l-4 border-primaryL pl-4">
                  {SUB_TAGLINE}
              </p>
              <button className="self-start bg-primaryL border-4 border-black px-10 py-5 text-xl font-black uppercase hover:shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-all flex items-center gap-2">
                  Get Access <ArrowUpRight size={28} strokeWidth={3} />
              </button>
          </div>
          <div className="bg-black relative overflow-hidden group">
              <img src="https://picsum.photos/id/249/1000/1000" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity duration-300 mix-blend-hard-light" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-white p-12 rounded-full rotate-12 group-hover:rotate-0 transition-transform duration-500 bg-black/50 backdrop-blur">
                      <span className="text-white text-3xl font-black uppercase">Play Loud</span>
                  </div>
              </div>
          </div>
      </section>

      {/* Features */}
      <section className="border-b-4 border-black">
          <div className="grid md:grid-cols-3">
              {FEATURES.map((feature, idx) => (
                  <div key={idx} className="p-12 border-b-4 md:border-b-0 md:border-r-4 border-black last:border-r-0 hover:bg-primaryL transition-colors group">
                      <div className="mb-6 border-4 border-black w-16 h-16 flex items-center justify-center bg-white shadow-[4px_4px_0px_#000]">
                          <GetIcon name={feature.icon} />
                      </div>
                      <h3 className="text-3xl font-black uppercase mb-4 leading-none">{feature.title}</h3>
                      <p className="font-medium text-lg leading-tight">{feature.description}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* Pricing - Big Tables */}
      <section className="bg-slate-100 p-6 md:p-20">
          <div className="max-w-7xl mx-auto border-4 border-black bg-white shadow-[12px_12px_0px_#000]">
              <div className="grid md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className={`p-8 md:p-12 flex flex-col ${plan.recommended ? 'bg-primaryL' : 'bg-white'}`}>
                          <h3 className="text-2xl font-black uppercase mb-2 border-b-4 border-black pb-2 inline-block self-start">{plan.name}</h3>
                          <div className="text-6xl font-black mb-8 mt-4">
                              ¥{plan.price}
                          </div>
                          <ul className="flex-1 space-y-4 mb-12">
                              {plan.features.map((f, i) => (
                                  <li key={i} className="font-bold text-lg flex items-center gap-3">
                                      <div className="w-3 h-3 bg-black"></div>
                                      {f}
                                  </li>
                              ))}
                          </ul>
                          <button className="w-full border-4 border-black py-4 font-black uppercase hover:bg-black hover:text-white transition-colors">
                              Select Plan
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <footer className="bg-black text-white p-12 md:p-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end">
              <div>
                  <h2 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6">Biz<br/>Sound</h2>
                  <p className="font-mono text-sm">COPYRIGHT FREE. HASSLE FREE.</p>
              </div>
              <div className="flex gap-4 mt-8 md:mt-0">
                   <a href="#" className="font-bold underline hover:text-primaryL">INSTAGRAM</a>
                   <a href="#" className="font-bold underline hover:text-primaryL">TWITTER</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default BoldTheme;