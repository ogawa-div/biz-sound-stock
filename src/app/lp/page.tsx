import { Metadata } from 'next';
import AbstractTheme from '@/components/lp/AbstractTheme';

export const metadata: Metadata = {
  title: 'BizSound Stock - 法的リスクゼロの店舗BGMを月額980円から',
  description: '個人向け音楽アプリの商用利用は規約違反のリスクがあります。JASRAC申請不要・工事不要の完全著作権フリーBGMサービス。月額980円（税込）で安心・安全な店舗BGMを。',
  keywords: 'BGM, 店舗BGM, 著作権フリー, JASRAC不要, 商用利用OK, カフェBGM, 美容室BGM, 規約違反',
  openGraph: {
    title: 'BizSound Stock - 法的リスクゼロの店舗BGMを月額980円から',
    description: 'JASRAC申請不要・工事不要。規約違反リスクなしの店舗向けBGMサービス。14日間無料トライアル実施中。',
    type: 'website',
  },
};

export default function LandingPage() {
  return <AbstractTheme />;
}
