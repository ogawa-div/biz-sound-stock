"use client"

import { useEffect, useState } from "react"

type Song = {
  id: string
  title: string
  artist: string
}

export default function TestPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [status, setStatus] = useState("初期状態")

  useEffect(() => {
    setStatus("データ取得中...")
    console.log("[Test] Starting fetch with raw fetch API...")

    // Supabaseクライアントを使わず、直接fetch APIでテスト
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/songs?select=id,title,artist&order=created_at.desc`
    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("[Test] URL:", url)
    console.log("[Test] API Key exists:", !!apiKey)

    fetch(url, {
      headers: {
        "apikey": apiKey || "",
        "Authorization": `Bearer ${apiKey}`,
      },
    })
      .then((res) => {
        console.log("[Test] Response status:", res.status)
        return res.json()
      })
      .then((data) => {
        console.log("[Test] Data:", data)
        if (Array.isArray(data)) {
          setSongs(data)
          setStatus(`完了: ${data.length}曲取得`)
        } else {
          setStatus(`エラー: ${JSON.stringify(data)}`)
        }
      })
      .catch((err) => {
        console.error("[Test] Fetch error:", err)
        setStatus(`例外: ${err.message}`)
      })
  }, [])

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "white", background: "#1a1a2e", minHeight: "100vh" }}>
      <h1>テストページ（fetch API直接）</h1>
      
      <p><strong>ステータス:</strong> {status}</p>
      <p><strong>曲数:</strong> {songs.length}</p>
      
      <h2>曲リスト:</h2>
      {songs.length === 0 ? (
        <p style={{ color: "#888" }}>曲がありません</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.id} style={{ marginBottom: "8px" }}>
              <strong>{song.title}</strong> - {song.artist}
            </li>
          ))}
        </ul>
      )}
      
      <hr style={{ margin: "20px 0", borderColor: "#333" }} />
      <p style={{ fontSize: "12px", color: "#666" }}>
        開発者ツール（F12 → Console / Network）でログを確認
      </p>
    </div>
  )
}
