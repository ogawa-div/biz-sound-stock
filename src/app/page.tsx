import { MusicPlayer } from "@/components/music-player"
import { Sidebar } from "@/components/sidebar"
import { SongList } from "@/components/song-list"

export default function Home() {
  return (
    <div className="flex h-safe-screen flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* モバイル: ヘッダー(3.5rem) + セーフエリア分の余白, デスクトップ: 余白なし */}
        <main 
          className="flex-1 overflow-y-auto overscroll-none md:pt-0"
          style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}
        >
          <SongList />
        </main>
      </div>
      <MusicPlayer />
    </div>
  )
}
