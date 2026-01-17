"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Music, Crown } from "lucide-react"
import { useState, useEffect } from "react"
import { usePlayerStore } from "@/store/player-store"
import { useAuth } from "@/lib/auth/context"
import { UpgradePrompt } from "@/components/upgrade-prompt"

// Format seconds to mm:ss
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function MusicPlayer() {
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useAuth()
  
  // Player store state
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const currentSong = usePlayerStore((state) => state.currentSong)
  const currentPlaylist = usePlayerStore((state) => state.currentPlaylist)
  const volume = usePlayerStore((state) => state.volume)
  const progress = usePlayerStore((state) => state.progress)
  const duration = usePlayerStore((state) => state.duration)
  const isMuted = usePlayerStore((state) => state.isMuted)
  const isPreview = usePlayerStore((state) => state.isPreview)
  const previewDuration = usePlayerStore((state) => state.previewDuration)
  
  // Player store actions
  const toggle = usePlayerStore((state) => state.toggle)
  const next = usePlayerStore((state) => state.next)
  const previous = usePlayerStore((state) => state.previous)
  const setVolume = usePlayerStore((state) => state.setVolume)
  const seek = usePlayerStore((state) => state.seek)
  const toggleMute = usePlayerStore((state) => state.toggleMute)
  const setUserId = usePlayerStore((state) => state.setUserId)

  // Sync user ID with player store
  useEffect(() => {
    setUserId(user?.id || null)
  }, [user?.id, setUserId])

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0

  // Handle progress slider change
  const handleProgressChange = (value: number[]) => {
    seek(value[0])
  }

  // Handle volume slider change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
  }

  // Placeholder image for songs without cover
  const coverImage = currentSong?.cover_image_url || "/abstract-soundscape.png"

  // For preview mode, show limited duration
  const displayDuration = isPreview ? previewDuration : duration

  return (
    <>
      <UpgradePrompt />
      <div className="border-t border-border bg-card">
        <div className="flex items-center gap-4 px-4 py-3 md:px-6 md:py-4">
          {/* Song Info */}
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-secondary md:h-14 md:w-14">
              {isPreview && currentSong && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                  <div className="flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                    <Crown className="h-2.5 w-2.5" />
                    30秒
                  </div>
                </div>
              )}
            {currentSong ? (
              <img 
                src={coverImage} 
                alt={currentSong.title} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-foreground">
              {currentSong?.title || "曲を選択してください"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {currentSong?.artist || currentPlaylist?.title || "プレイリストを選択"}
            </p>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsFavorite(!isFavorite)} 
            className="flex-shrink-0"
            disabled={!currentSong}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-accent text-accent" : ""}`} />
          </Button>
        </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center gap-1 md:flex-1 md:gap-2">
            <div className="flex items-center gap-1 md:gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={previous}
                disabled={!currentSong}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={toggle}
                disabled={!currentSong}
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current" />
                )}
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={next}
                disabled={!currentSong}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="hidden w-full max-w-md items-center gap-2 md:flex">
              <span className="w-10 text-right text-xs text-muted-foreground">
                {formatTime(progress)}
              </span>
              <Slider 
                value={[progressPercent]} 
                onValueChange={handleProgressChange} 
                max={100} 
                step={0.1} 
                className="flex-1"
                disabled={!currentSong}
              />
              <span className="w-10 text-xs text-muted-foreground">
                {formatTime(displayDuration)}
              </span>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <Slider 
              value={[isMuted ? 0 : volume]} 
              onValueChange={handleVolumeChange} 
              max={100} 
              step={1} 
              className="w-24" 
            />
          </div>
        </div>
      </div>
    </>
  )
}
