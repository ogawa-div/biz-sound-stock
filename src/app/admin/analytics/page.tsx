"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"
import { Loader2 } from "lucide-react"

// Mock data for demo - will be replaced with real API calls
const mockDailyPlays = [
  { date: "1/10", play_count: 1234 },
  { date: "1/11", play_count: 1456 },
  { date: "1/12", play_count: 1678 },
  { date: "1/13", play_count: 1890 },
  { date: "1/14", play_count: 2102 },
  { date: "1/15", play_count: 1987 },
  { date: "1/16", play_count: 2234 },
]

const mockGenreData = [
  { genre: "ジャズ", play_count: 4520, fill: "#3b82f6" },
  { genre: "ポップ", play_count: 3890, fill: "#f59e0b" },
  { genre: "ボサノバ", play_count: 2340, fill: "#10b981" },
  { genre: "アンビエント", play_count: 1890, fill: "#8b5cf6" },
  { genre: "ラウンジ", play_count: 1560, fill: "#ec4899" },
]

const mockBusinessTypeData = [
  { business_type: "カフェ", jazz: 1200, pop: 800, bossa_nova: 600, ambient: 400 },
  { business_type: "美容室", jazz: 600, pop: 1100, bossa_nova: 300, ambient: 800 },
  { business_type: "レストラン", jazz: 1400, pop: 600, bossa_nova: 900, ambient: 300 },
  { business_type: "ホテル", jazz: 800, pop: 400, bossa_nova: 500, ambient: 1200 },
  { business_type: "アパレル", jazz: 300, pop: 1300, bossa_nova: 200, ambient: 400 },
]

const mockTopSongs = [
  { rank: 1, title: "Morning Cafe Jazz", artist: "BGM Masters", play_count: 2456 },
  { rank: 2, title: "Sunset Lounge", artist: "Chill Vibes", play_count: 2234 },
  { rank: 3, title: "Tokyo Night", artist: "Urban Sounds", play_count: 1987 },
  { rank: 4, title: "Ocean Breeze", artist: "Nature Music", play_count: 1876 },
  { rank: 5, title: "Coffee Time", artist: "Acoustic Dreams", play_count: 1654 },
]

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"]

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("7d")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">分析ダッシュボード</h1>
          <p className="mt-2 text-muted-foreground">
            再生データと業種別の傾向を分析します
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="7d">過去7日間</option>
          <option value="30d">過去30日間</option>
          <option value="90d">過去90日間</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">総再生回数</p>
            <p className="text-3xl font-bold text-foreground">12,581</p>
            <p className="text-sm text-green-500">+15.3% 前週比</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">ユニークユーザー</p>
            <p className="text-3xl font-bold text-foreground">456</p>
            <p className="text-sm text-green-500">+8.2% 前週比</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">平均再生時間</p>
            <p className="text-3xl font-bold text-foreground">4.2分</p>
            <p className="text-sm text-amber-500">-2.1% 前週比</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">完了率</p>
            <p className="text-3xl font-bold text-foreground">78%</p>
            <p className="text-sm text-green-500">+3.4% 前週比</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Daily Plays */}
        <Card>
          <CardHeader>
            <CardTitle>日別再生回数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockDailyPlays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#f8fafc" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="play_count" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b" }}
                    name="再生回数"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>ジャンル別再生分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockGenreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="play_count"
                    nameKey="genre"
                    label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {mockGenreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Genre by Business Type */}
        <Card>
          <CardHeader>
            <CardTitle>業種別ジャンル傾向</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBusinessTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="business_type" 
                    stroke="#94a3b8" 
                    fontSize={12}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="jazz" name="ジャズ" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="pop" name="ポップ" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="bossa_nova" name="ボサノバ" fill="#10b981" stackId="a" />
                  <Bar dataKey="ambient" name="アンビエント" fill="#8b5cf6" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Songs */}
        <Card>
          <CardHeader>
            <CardTitle>人気楽曲ランキング</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTopSongs.map((song) => (
                <div key={song.rank} className="flex items-center gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    song.rank <= 3 ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {song.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{song.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{song.play_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">再生</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
