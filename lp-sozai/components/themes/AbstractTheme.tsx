import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Layers, Scissors, Music } from 'lucide-react';

const AbstractTheme: React.FC = () => {
  return (
    <div className="font-block text-slate-900 bg-bgQ min-h-screen overflow-x-hidden selection:bg-secondaryQ selection:text-white">
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")'}}></div>

      {/* Navbar */}
      <nav className="p-8 flex justify-between items-center relative z-20">
        <div className="text-4xl uppercase tracking-tighter transform -rotate-2 bg-primaryQ text-white px-4 py-1">
            {SERVICE_NAME}
        </div>
        <button className="bg-secondaryQ text-white rounded-full px-6 py-4 font-sans font-bold hover:scale-110 transition-transform shadow-lg">
            MENU
        </button>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center">
             <div className="md:col-span-7 relative">
                 <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply opacity-80 animate-pulse"></div>
                 <h1 className="text-7xl md:text-9xl leading-[0.85] mb-8 relative z-10">
                     JAZZY<br/>
                     <span className="text-secondaryQ">VIBES</span><br/>
                     ONLY.
                 </h1>
                 <p className="font-sans font-bold text-slate-600 text-xl max-w-md bg-white p-4 border-2 border-black shadow-[4px_4px_0px_#000] transform rotate-1">
                     {SUB_TAGLINE}
                 </p>
                 <button className="mt-8 bg-black text-white px-10 py-4 text-2xl uppercase hover:bg-primaryQ transition-colors transform -rotate-1 hover:rotate-0">
                     Listen Now
                 </button>
             </div>
             
             <div className="md:col-span-5 relative">
                 {/* Collage Style Image */}
                 <div className="relative w-full aspect-square">
                     <div className="absolute inset-0 bg-primaryQ transform rotate-3"></div>
                     <div className="absolute inset-0 bg-secondaryQ transform -rotate-2 scale-95"></div>
                     <img src="https://picsum.photos/id/338/600/600" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 transform rotate-1 border-4 border-white" />
                     {/* Torn Paper Effect CSS */}
                     <div className="absolute -bottom-10 -right-10 bg-white p-4 font-sans font-bold text-sm shadow-xl transform -rotate-6 border border-gray-200">
                         <p>Artist: Unknown</p>
                         <p>Track: 04</p>
                     </div>
                 </div>
             </div>
        </div>
      </section>

      {/* Features - Cutout style */}
      <section className="py-32 px-6 bg-primaryQ text-white relative clip-path-slant">
          <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl mb-16 text-center transform -rotate-1">THE COLLECTION</h2>
              <div className="grid md:grid-cols-3 gap-12">
                  {FEATURES.map((feature, idx) => (
                      <div key={idx} className="relative group">
                          <div className="absolute inset-0 bg-secondaryQ transform translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
                          <div className="relative bg-white text-slate-900 p-8 border-2 border-black h-full">
                              <div className="text-4xl mb-4 text-secondaryQ">
                                  <GetIcon name={feature.icon} />
                              </div>
                              <h3 className="text-2xl uppercase mb-3 leading-none">{feature.title}</h3>
                              <p className="font-sans font-medium text-slate-500 leading-tight">{feature.description}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Pricing - Poster Style */}
      <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto">
              <div className="bg-white border-4 border-black p-8 md:p-16 shadow-[20px_20px_0px_rgba(30,41,59,0.2)]">
                  <h2 className="text-6xl text-center mb-12 uppercase leading-none">Price<br/>List</h2>
                  
                  <div className="space-y-8">
                      {PLANS.map((plan, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row items-center gap-4 border-b-4 border-black pb-4 last:border-0">
                              <div className="bg-black text-white text-xl px-4 py-2 transform -rotate-2 w-full md:w-auto text-center">
                                  {plan.name}
                              </div>
                              <div className="flex-1 font-sans font-bold text-slate-500 text-sm text-center md:text-left">
                                  {plan.features.join(' + ')}
                              </div>
                              <div className="text-4xl text-secondaryQ">
                                  ¥{plan.price}
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="mt-12 text-center">
                      <button className="bg-secondaryQ text-white text-2xl px-12 py-3 hover:bg-black transition-colors shadow-[8px_8px_0px_#000]">
                          Subscribe
                      </button>
                  </div>
              </div>
          </div>
      </section>

      <footer className="bg-black text-white py-12 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-2xl uppercase tracking-tighter">
                  {SERVICE_NAME}
              </div>
              <div className="font-sans text-sm text-gray-400">
                  Collage Art & Music Curation.
              </div>
          </div>
      </footer>
    </div>
  );
};

export default AbstractTheme;