import React from 'react';
import { SERVICE_NAME, TAGLINE, SUB_TAGLINE, FEATURES, PLANS, USE_CASES, TESTIMONIALS } from '../../constants';
import { GetIcon } from '../icons';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const CleanTheme: React.FC = () => {
  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primaryC rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">{SERVICE_NAME}</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-primaryC">機能</a>
            <a href="#" className="hover:text-primaryC">料金</a>
            <a href="#" className="hover:text-primaryC">導入事例</a>
          </div>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900">ログイン</button>
            <button className="bg-primaryC text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-800 transition-colors shadow-sm">
              無料で試す
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            店舗BGMの<br className="md:hidden"/>
            <span className="text-primaryC">新しいスタンダード</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            {SUB_TAGLINE}<br/>
            法的な心配をゼロに。あなたのビジネスに集中できる環境を。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="bg-primaryC text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-cyan-800 transition-all shadow-lg shadow-cyan-500/20">
               14日間無料トライアル
             </button>
             <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors">
               資料ダウンロード
             </button>
          </div>
          <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400 font-medium">
             <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-primaryC"/> クレジットカード不要</span>
             <span className="flex items-center gap-1"><CheckCircle2 size={16} className="text-primaryC"/> 即日利用開始</span>
          </div>
        </div>
        
        {/* Hero Image / Dashboard Preview */}
        <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-2xl overflow-hidden aspect-video relative group">
                <img src="https://picsum.photos/id/3/1200/800" alt="Dashboard" className="object-cover opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-transparent transition-all">
                    <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-lg shadow-lg text-sm font-medium text-slate-600">
                        Image: Simple Management Dashboard
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Stats / Logos */}
      <div className="bg-gray-50 py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Trusted by 1,000+ Businesses</p>
            <div className="flex justify-center gap-8 md:gap-16 opacity-40 grayscale">
                {/* Simulated Logos */}
                <div className="font-bold text-xl">CAFÉ LINK</div>
                <div className="font-bold text-xl">HAIR&MAKE</div>
                <div className="font-bold text-xl">GYM X</div>
                <div className="font-bold text-xl">OFFICE ONE</div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">BizSoundが選ばれる理由</h2>
            <p className="mt-4 text-gray-500">店舗運営の課題を解決する、シンプルで強力な機能。</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-secondaryC rounded-lg flex items-center justify-center text-primaryC mb-4">
                        <GetIcon name={feature.icon} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
             <h2 className="text-3xl font-bold text-center mb-16">導入店舗の声</h2>
             <div className="grid md:grid-cols-2 gap-8">
                {TESTIMONIALS.map((t, idx) => (
                    <div key={idx} className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                        <p className="text-lg text-slate-300 mb-6">"{t.comment}"</p>
                        <div className="flex items-center gap-4">
                            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <div className="font-bold">{t.name}</div>
                                <div className="text-sm text-slate-400">{t.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">料金プラン</h2>
        <p className="text-center text-gray-500 mb-16">シンプルで透明性の高い価格設定。</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map((plan, idx) => (
                <div key={idx} className={`rounded-2xl p-8 border ${plan.recommended ? 'border-primaryC ring-2 ring-primaryC/20 bg-white shadow-xl relative' : 'border-gray-200 bg-gray-50'}`}>
                    {plan.recommended && <div className="absolute top-0 right-0 bg-primaryC text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">人気</div>}
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-6">
                        <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                        <span className="text-gray-500 ml-1">円 / 月</span>
                    </div>
                    <button className={`w-full py-2.5 rounded-lg font-bold mb-8 transition-colors ${plan.recommended ? 'bg-primaryC text-white hover:bg-cyan-800' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                        今すぐ登録
                    </button>
                    <ul className="space-y-3">
                        {plan.features.map((f, i) => (
                            <li key={i} className="flex items-start text-sm text-gray-600">
                                <CheckCircle2 size={18} className="text-green-500 mr-2 shrink-0" />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      </section>

      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>&copy; 2024 {SERVICE_NAME}.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-primaryC">プライバシーポリシー</a>
                <a href="#" className="hover:text-primaryC">特定商取引法に基づく表記</a>
                <a href="#" className="hover:text-primaryC">お問い合わせ</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanTheme;