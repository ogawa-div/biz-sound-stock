import { MusicPlayer } from "@/components/music-player"
import { Sidebar } from "@/components/sidebar"
import { SongList } from "@/components/song-list"

export default function Home() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overscroll-none pt-14 md:pt-0">
          <SongList />
        </main>
      </div>
      <MusicPlayer />
    </div>
  )
}
