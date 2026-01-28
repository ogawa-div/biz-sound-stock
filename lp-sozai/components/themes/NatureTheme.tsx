import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS } from '../../constants';
import { GetIcon } from '../icons';
import { Leaf, Sun, Wind } from 'lucide-react';

const NatureTheme: React.FC = () => {
  return (
    <div className="font-sans text-stone-700 bg-bgF">
      {/* Organic Header */}
      <header className="absolute w-full z-50 pt-8">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <div className="text-2xl font-serif font-bold text-primaryF flex items-center gap-2">
                <Leaf className="fill-current" size={24} />
                {SERVICE_NAME}
            </div>
            <button className="bg-white/80 backdrop-blur text-primaryF px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow text-sm font-medium border border-secondaryF">
                Start Free Trial
            </button>
        </div>
      </header>

      {/* Hero with Organic Shapes */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Organic Background Blobs */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-secondaryF rounded-bl-[200px] -z-10 opacity-60"></div>
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <span className="text-accentF font-bold tracking-widest text-sm mb-4 block uppercase">Organic Sound Life</span>
                <h1 className="text-5xl font-serif font-medium text-stone-800 leading-[1.2] mb-6">
                    自然な音で、<br/>
                    心安らぐ空間を。
                </h1>
                <p className="text-stone-600 mb-10 leading-relaxed text-lg">
                    {SUB_TAGLINE}
                </p>
                <div className="flex gap-4">
                    <button className="bg-primaryF text-white px-8 py-3 rounded-tr-xl rounded-bl-xl hover:bg-lime-800 transition-colors shadow-lg shadow-lime-700/20">
                        プランを見る
                    </button>
                    <button className="text-primaryF font-bold flex items-center gap-2 px-6 py-3 hover:bg-secondaryF rounded-lg transition-colors">
                        <Sun size={20} /> デモを聴く
                    </button>
                </div>
            </div>
            <div className="relative">
                <div className="relative z-10 rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-2xl border-4 border-white">
                    <img src="https://picsum.photos/id/292/600/600" alt="Nature" className="object-cover w-full h-full" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 text-primaryF/20">
                    <Leaf size={120} />
                </div>
            </div>
        </div>
      </section>

      {/* Features with Soft Cards */}
      <section className="py-24 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-serif text-stone-800 mb-4">Features</h2>
                <div className="w-16 h-1 bg-primaryF mx-auto rounded-full opacity-50"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
                {FEATURES.map((feature, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-bgF rounded-full flex items-center justify-center text-primaryF mb-6">
                            <GetIcon name={feature.icon} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">{feature.title}</h3>
                        <p className="text-stone-500 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Mood Strip */}
      <section className="py-20 bg-primaryF text-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
              <Wind className="mx-auto mb-6 opacity-80" size={48} />
              <h2 className="text-3xl font-serif mb-8">"まるで森の中にいるような、心地よい音環境"</h2>
              <p className="max-w-2xl mx-auto opacity-90 text-lg">
                  ヨガスタジオ、オーガニックカフェ、フラワーショップなど、<br/>
                  自然体で過ごしたい場所に最適なBGMをお届けします。
              </p>
          </div>
      </section>

      {/* Plans */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-16 text-stone-800">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
              {PLANS.map((plan, idx) => (
                  <div key={idx} className={`bg-white p-8 rounded-2xl border ${plan.recommended ? 'border-primaryF shadow-xl' : 'border-stone-200'} flex flex-col`}>
                      <h3 className="text-lg font-bold text-stone-600 mb-2">{plan.name}</h3>
                      <div className="text-4xl font-serif text-primaryF mb-6">¥{plan.price}</div>
                      <ul className="space-y-4 mb-8 flex-1">
                          {plan.features.map((f, i) => (
                              <li key={i} className="flex items-center text-stone-600 text-sm">
                                  <span className="w-2 h-2 bg-primaryF rounded-full mr-3 opacity-60"></span>
                                  {f}
                              </li>
                          ))}
                      </ul>
                      <button className={`w-full py-3 rounded-lg font-medium transition-colors ${plan.recommended ? 'bg-primaryF text-white hover:bg-lime-800' : 'bg-secondaryF text-primaryF hover:bg-lime-200'}`}>
                          選択する
                      </button>
                  </div>
              ))}
          </div>
      </section>

      <footer className="bg-stone-100 py-12 text-center text-stone-500 text-sm">
          <div className="flex justify-center gap-4 mb-6">
              <a href="#" className="hover:text-primaryF">Instagram</a>
              <a href="#" className="hover:text-primaryF">Twitter</a>
          </div>
          <p>© {SERVICE_NAME} - Sustainable Music Solution.</p>
      </footer>
    </div>
  );
};

export default NatureTheme;