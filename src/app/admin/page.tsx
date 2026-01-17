"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, ListMusic, Users, TrendingUp } from "lucide-react"

// Stats cards data (will be replaced with real data)
const stats = [
  {
    title: "総楽曲数",
    value: "156",
    change: "+12 今月",
    icon: Music,
    color: "text-blue-500",
  },
  {
    title: "プレイリスト数",
    value: "24",
    change: "+3 今月",
    icon: ListMusic,
    color: "text-amber-500",
  },
  {
    title: "アクティブユーザー",
    value: "1,234",
    change: "+8.2%",
    icon: Users,
    color: "text-green-500",
  },
  {
    title: "今月の再生回数",
    value: "45,678",
    change: "+15.3%",
    icon: TrendingUp,
    color: "text-purple-500",
  },
]

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
        <p className="mt-2 text-muted-foreground">
          BizSound Stockの運営状況を一目で確認できます
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="/admin/songs/new"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
            >
              <Music className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">新しい楽曲を追加</p>
                <p className="text-sm text-muted-foreground">
                  MP3ファイルをアップロードして楽曲を登録
                </p>
              </div>
            </a>
            <a
              href="/admin/playlists/new"
              className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
            >
              <ListMusic className="h-5 w-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">新しいプレイリストを作成</p>
                <p className="text-sm text-muted-foreground">
                  楽曲を選んでプレイリストを作成
                </p>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">スプリングカフェ2024</span>
                  {" "}が公開されました
                </p>
                <span className="ml-auto text-xs text-muted-foreground">2時間前</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <p className="text-sm text-muted-foreground">
                  新しい楽曲が
                  <span className="font-medium text-foreground"> 5曲 </span>
                  追加されました
                </p>
                <span className="ml-auto text-xs text-muted-foreground">5時間前</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">トレンディサロンミックス</span>
                  {" "}が更新されました
                </p>
                <span className="ml-auto text-xs text-muted-foreground">1日前</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
