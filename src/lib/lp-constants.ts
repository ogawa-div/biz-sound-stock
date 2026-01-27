import { Feature, PricingPlan, Testimonial } from '@/types/lp-types';

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
    title: '24/7ストリーミング',
    description: '150曲以上の高品質BGMが24時間365日、途切れることなく流れ続けます。店舗の雰囲気を常に最適な状態に保ちます。',
    icon: 'Zap'
  },
  {
    id: 'f3',
    title: '圧倒的なコストパフォーマンス',
    description: '従来の有線放送やCD購入に比べ、月額2,980円で無制限再生。経費削減に貢献します。',
    icon: 'Wallet'
  }
];

export const PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '0',
    features: ['全曲リスト閲覧', '1曲あたり30秒まで再生', 'プレビュー再生のみ'],
    recommended: false
  },
  {
    name: 'Standard',
    price: '980',
    features: [
      '全曲フル再生',
      '無制限の音楽再生',
      'お気に入り機能',
      '高音質ストリーミング'
    ],
    recommended: true
  },
  {
    name: 'Early Bird',
    price: '500',
    features: [
      '全曲フル再生',
      '無制限の音楽再生',
      'お気に入り機能',
      '高音質ストリーミング',
      'リリース記念キャンペーン価格'
    ],
    recommended: false
  }
];

export const USE_CASES = [
  { 
    label: 'Cafe & Restaurant', 
    iconName: 'Coffee', 
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop' 
  },
  { 
    label: 'Beauty Salon', 
    iconName: 'Scissors', 
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop' 
  },
  { 
    label: 'Fitness Gym', 
    iconName: 'Dumbbell', 
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop' 
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: '田中 優子',
    role: 'カフェオーナー',
    comment: '毎月のJASRACへの支払いがなくなり、コストが大幅に下がりました。選曲もセンスが良く、お客様からも好評です。',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  {
    name: '佐藤 健一',
    role: '美容室店長',
    comment: '以前はCDを入れ替えていましたが、今はiPad一つで操作完了。スタッフの負担が減り、施術に集中できます。',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  }
];
