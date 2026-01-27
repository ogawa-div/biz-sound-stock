// Plan configuration (client-safe)
export const PLANS = {
  free: {
    name: "Free",
    description: "30秒プレビューでお試し",
    price: 0,
    features: [
      "全曲リスト閲覧",
      "1曲あたり30秒まで再生",
      "プレビュー再生のみ",
    ],
  },
  standard: {
    name: "Standard",
    description: "全曲フル再生が可能",
    price: 980,
    features: [
      "全曲フル再生",
      "無制限の音楽再生",
      "お気に入り機能",
      "高音質ストリーミング",
    ],
    stripePriceId: "standard", // STRIPE_PRICES.STANDARD に対応
  },
  earlyBird: {
    name: "Early Bird",
    description: "リリース記念キャンペーン価格",
    price: 500,
    features: [
      "全曲フル再生",
      "無制限の音楽再生",
      "お気に入り機能",
      "高音質ストリーミング",
      "Standardと同じ機能",
    ],
    stripePriceId: "earlyBird", // STRIPE_PRICES.EARLY_BIRD に対応
    isCampaign: true,
  },
} as const

export type PlanType = keyof typeof PLANS
