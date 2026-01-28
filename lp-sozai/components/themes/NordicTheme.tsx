import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { ArrowRight, Minus } from 'lucide-react';

const NordicTheme: React.FC = () => {
  return (
    <div className="font-sans text-slate-600 bg-bgK selection:bg-primaryK selection:text-white">
      {/* Navbar */}
      <nav className="pt-12 pb-8 px-8 max-w-7xl mx-auto flex justify-between items-center">
        <div className="font-bold text-slate-800 tracking-tight text-lg">
          {SERVICE_NAME}
        </div>
        <div className="hidden md:flex gap-12 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Work</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Studio</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 pb-32 pt-20 max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
         <div className="md:col-span-7">
             <h1 className="text-5xl md:text-7xl font-light text-slate-900 mb-8 leading-tight tracking-tight">
                 Simple music <br/>
                 for <span className="italic font-serif">better</span> spaces.
             </h1>
             <p className="text-lg text-slate-500 mb-12 max-w-md leading-relaxed">
                 {SUB_TAGLINE}
             </p>
             <button className="bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-slate-700 transition-all flex items-center gap-4 group">
                 Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16}/>
             </button>
         </div>
         <div className="md:col-span-5 relative">
             <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200">
                 <img src="https://picsum.photos/id/103/800/1200" className="object-cover w-full h-full grayscale opacity-90 hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-out" />
             </div>
         </div>
      </section>

      {/* Features - Minimal List */}
      <section className="bg-white py-32 px-8">
          <div className="max-w-4xl mx-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-16 block">Capabilities</span>
              
              <div className="grid gap-16">
                  {FEATURES.map((feature, idx) => (
                      <div key={idx} className="grid md:grid-cols-12 gap-8 items-start group border-t border-slate-100 pt-16">
                          <div className="md:col-span-1 text-slate-300 font-serif italic text-2xl group-hover:text-slate-900 transition-colors">
                              {idx + 1}
                          </div>
                          <div className="md:col-span-4">
                              <h3 className="text-2xl text-slate-900 font-medium mb-2">{feature.title}</h3>
                          </div>
                          <div className="md:col-span-7">
                              <p className="text-slate-500 leading-loose">{feature.description}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing - Cards */}
      <section className="py-32 px-8 bg-bgK">
          <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-16">
                   <h2 className="text-3xl font-light text-slate-900">Membership</h2>
                   <p className="text-slate-400 text-sm hidden md:block">Simple pricing, no hidden fees.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                  {PLANS.map((plan, idx) => (
                      <div key={idx} className={`p-10 rounded-3xl transition-all duration-300 ${plan.recommended ? 'bg-white shadow-xl shadow-slate-200/50' : 'bg-transparent border border-slate-200 hover:bg-white hover:border-transparent'}`}>
                          <div className="flex justify-between items-start mb-8">
                              <h3 className="text-xl font-medium text-slate-900">{plan.name}</h3>
                              {plan.recommended && <div className="w-2 h-2 rounded-full bg-slate-900"></div>}
                          </div>
                          <div className="text-4xl font-light text-slate-900 mb-8 tracking-tighter">
                              ¥{plan.price}
                          </div>
                          <ul className="space-y-4 mb-10">
                              {plan.features.map((f, i) => (
                                  <li key={i} className="text-sm text-slate-500 flex items-center gap-3">
                                      <Minus size={12} className="text-slate-300" /> {f}
                                  </li>
                              ))}
                          </ul>
                          <button className={`w-full py-4 rounded-xl text-sm font-medium transition-colors ${plan.recommended ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                              Choose Plan
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <footer className="bg-white py-12 px-8 border-t border-slate-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-slate-400 text-sm font-medium">
              <p>{SERVICE_NAME} © {new Date().getFullYear()}</p>
              <div className="flex gap-8 mt-4 md:mt-0">
                  <a href="#" className="hover:text-slate-900">Instagram</a>
                  <a href="#" className="hover:text-slate-900">Twitter</a>
                  <a href="#" className="hover:text-slate-900">Email</a>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default NordicTheme;