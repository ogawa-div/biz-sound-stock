import { Metadata } from 'next';
import AbstractTheme from '@/components/lp/AbstractTheme';

export const metadata: Metadata = {
  title: 'BizSound Stock - 店舗向け著作権フリーBGMサービス',
  description: 'JASRAC申請不要。月額定額で著作権フリーの高品質BGMを流し放題。カフェ、美容室、ジムなど様々な店舗でご利用いただけます。',
  keywords: 'BGM, 店舗BGM, 著作権フリー, JASRAC, カフェBGM, 美容室BGM, ジムBGM',
  openGraph: {
    title: 'BizSound Stock - 店舗向け著作権フリーBGMサービス',
    description: 'JASRAC申請不要。月額定額で著作権フリーの高品質BGMを流し放題。',
    type: 'website',
  },
};

export default function LandingPage() {
  return <AbstractTheme />;
}
