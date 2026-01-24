import { MusicPlayer } from "@/components/music-player"
import { Sidebar } from "@/components/sidebar"
import { SongList } from "@/components/song-list"

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
          <SongList />
        </main>
      </div>
      <MusicPlayer />
    </div>
  )
}
