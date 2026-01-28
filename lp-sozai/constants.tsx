import React from 'react';
import { Music, ShieldCheck, Wallet, Zap, Coffee, Scissors, Dumbbell } from 'lucide-react';
import { Feature, PricingPlan, Testimonial } from './types';

export const SERVICE_NAME = "BizSound Stock";
export const TAGLINE = "店舗のBGM、もう迷わない。";
export const SUB_TAGLINE = "JASRAC申請不要。月額定額で著作権フリーの高品質BGMを流し放題。";

export const FEATURES: Feature[] = [
  {
    id: 'f1',
    title: 'JASRAC申請・支払い不要',
    description: '完全著作権フリーの楽曲のみを使用しているため、面倒な著作権処理や別途支払いは一切不要です。',
    icon: 'ShieldCheck'
  },
  {
    id: 'f2',
    title: 'AIによる最適選曲',
    description: '業種や時間帯、天気に合わせてAIが自動でプレイリストを生成。常に最適な空間を演出します。',
    icon: 'Zap'
  },
  {
    id: 'f3',
    title: '圧倒的なコストパフォーマンス',
    description: '従来の有線放送やCD購入に比べ、圧倒的な低価格で導入可能。経費削減に貢献します。',
    icon: 'Wallet'
  }
];

export const PLANS: PricingPlan[] = [
  {
    name: 'ライトプラン',
    price: '980',
    features: ['1店舗まで', '基本チャンネル利用可能', 'スマホ再生のみ'],
    recommended: false
  },
  {
    name: 'スタンダードプラン',
    price: '1,980',
    features: ['3店舗まで', '全チャンネル聴き放題', 'PC・タブレット再生', 'オフライン再生'],
    recommended: true
  },
  {
    name: 'エンタープライズ',
    price: '要相談',
    features: ['10店舗以上', '専用オリジナルBGM制作', 'API連携', '専任サポート'],
    recommended: false
  }
];

export const USE_CASES = [
  { label: 'Cafe & Restaurant', icon: <Coffee className="w-6 h-6" />, img: 'https://picsum.photos/id/431/600/400' },
  { label: 'Beauty Salon', icon: <Scissors className="w-6 h-6" />, img: 'https://picsum.photos/id/399/600/400' },
  { label: 'Fitness Gym', icon: <Dumbbell className="w-6 h-6" />, img: 'https://picsum.photos/id/235/600/400' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: '田中 優子',
    role: 'カフェオーナー',
    comment: '毎月のJASRACへの支払いがなくなり、コストが大幅に下がりました。選曲もセンスが良く、お客様からも好評です。',
    image: 'https://picsum.photos/id/64/100/100'
  },
  {
    name: '佐藤 健一',
    role: '美容室店長',
    comment: '以前はCDを入れ替えていましたが、今はiPad一つで操作完了。スタッフの負担が減り、施術に集中できます。',
    image: 'https://picsum.photos/id/91/100/100'
  }
];