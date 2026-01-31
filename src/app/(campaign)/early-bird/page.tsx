import { Metadata } from 'next';
import EarlyBirdTheme from './EarlyBirdTheme';

export const metadata: Metadata = {
  title: 'BizSound Stock - Early Bird 限定価格 月額500円【約49%OFF】',
  description: 'サービス開始記念！Early Bird限定価格で月額500円。通常980円が約49%OFF。JASRAC申請不要・工事不要の完全著作権フリーBGMサービスをワンコインで。',
  keywords: 'BGM, 店舗BGM, 著作権フリー, JASRAC不要, 商用利用OK, Early Bird, 早期割引, キャンペーン',
  openGraph: {
    title: 'BizSound Stock - Early Bird 限定価格 月額500円【約49%OFF】',
    description: 'サービス開始記念！通常980円が月額500円。ワンコインで使い放題の店舗向けBGMサービス。',
    type: 'website',
  },
};

export default function EarlyBirdPage() {
  return <EarlyBirdTheme />;
}
