// Plan configuration (client-safe)
export const PLANS = {
  free: {
    name: "Free",
    description: "基本機能をお試しください",
    price: 0,
    features: [
      "プレイリスト閲覧",
      "1日3曲まで再生",
      "広告あり",
    ],
  },
  premium: {
    name: "Premium",
    description: "すべての機能をフル活用",
    price: 2980,
    features: [
      "無制限の音楽再生",
      "すべてのプレイリストにアクセス",
      "広告なし",
      "オフライン再生",
      "高音質ストリーミング",
      "優先サポート",
    ],
  },
} as const

export type PlanType = keyof typeof PLANS
