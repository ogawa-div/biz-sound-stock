import { Feature, PricingPlan, Testimonial } from '@/types/lp-types';

export const SERVICE_NAME = "BizSound Stock";
export const TAGLINE = "お店のBGM、個人のスマホで流していませんか？";
export const SUB_TAGLINE = "JASRAC申請不要・工事不要。店舗経営者のための、賢く安全な新しい選択肢。";

// 比較セクション用のデータ
export const COMPARISON_OPTIONS = [
  {
    id: 'option1',
    title: '個人向け音楽アプリ',
    icon: 'Smartphone',
    pros: '手軽に始められる',
    cons: '商用利用は利用規約違反のリスクあり',
    highlight: false,
  },
  {
    id: 'option2',
    title: '従来のBGMサービス',
    icon: 'Radio',
    pros: '法的に安心',
    cons: '導入コストや月額費用が高くつく',
    highlight: false,
  },
  {
    id: 'option3',
    title: 'BizSound Stock',
    icon: 'ShieldCheck',
    pros: '規約準拠で安心・工事不要',
    cons: '月額980円（税込）の圧倒的低価格',
    highlight: true,
  },
];

export const FEATURES: Feature[] = [
  {
    id: 'f1',
    title: '完全著作権フリー',
    description: 'JASRACへの申請・支払いが不要。面倒な著作権処理なしで、安心して店舗BGMとしてご利用いただけます。',
    icon: 'ShieldCheck'
  },
  {
    id: 'f2',
    title: '工事不要・すぐ使える',
    description: 'インターネット環境があれば、今すぐスタート。専用機器の設置や工事は一切不要です。',
    icon: 'Zap'
  },
  {
    id: 'f3',
    title: '月額980円（税込）',
    description: '一般的なBGMサービスの数分の一の価格。圧倒的な低価格で、経費削減に貢献します。',
    icon: 'Wallet'
  }
];

export const PLANS: PricingPlan[] = [
  {
    name: 'Free',
    price: '0',
    features: ['全曲リスト閲覧', '1曲あたり30秒までプレビュー再生'],
    recommended: false
  },
  {
    name: 'Standard',
    price: '980',
    features: [
      '全曲フル再生',
      '無制限の音楽再生',
      'お気に入り機能',
      '高音質ストリーミング',
      '14日間無料トライアル'
    ],
    recommended: true
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
