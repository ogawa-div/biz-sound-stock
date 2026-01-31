"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Song, Playlist } from "@/types/database";

// ============================================
// Types
// ============================================
interface PlayerContextType {
  // State (Read-only from Audio events)
  isPlaying: boolean;
  isLoading: boolean;
  currentSong: Song | null;
  currentPlaylist: Playlist | null;
  queue: Song[];
  currentIndex: number;
  volume: number;
  progress: number;
  duration: number;
  isMuted: boolean;
  isPreview: boolean;
  showUpgradePrompt: boolean;

  // Actions
  playSong: (song: Song, playlist?: Playlist, queue?: Song[]) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (progress: number) => void;
  toggleMute: () => void;
  setUserId: (userId: string | null) => void;
  dismissUpgradePrompt: () => void;
  clearQueue: () => void;
}

interface StreamResponse {
  url: string;
  isPreview: boolean;
  previewDuration?: number;
  expiresAt: number;
}

// ============================================
// Context
// ============================================
const PlayerContext = createContext<PlayerContextType | null>(null);

// ============================================
// Single Global Audio Instance
// ============================================
let globalAudio: HTMLAudioElement | null = null;

const getAudio = (): HTMLAudioElement => {
  if (typeof window === "undefined") {
    throw new Error("Audio is only available in browser");
  }
  if (!globalAudio) {
    globalAudio = new Audio();
    globalAudio.preload = "auto";
    // iOS Safari: インラインで再生
    globalAudio.setAttribute("playsinline", "true");
    globalAudio.setAttribute("webkit-playsinline", "true");
  }
  return globalAudio;
};

// ============================================
// Helper Functions
// ============================================
const getStreamUrl = async (
  songId: string,
  userId: string | null
): Promise<StreamResponse> => {
  const response = await fetch("/api/songs/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ songId, userId }),
  });
  if (!response.ok) throw new Error("Failed to get stream URL");
  return response.json();
};

// Media Session API: ロック画面・通知センター対応
const updateMediaSession = (
  song: Song | null,
  handlers: {
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
  }
) => {
  if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

  try {
    if (song) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist || "BizSound Stock",
        album: "BizSound Radio",
        artwork: [
          { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
          { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
        ],
      });
    }

    navigator.mediaSession.setActionHandler("play", handlers.play);
    navigator.mediaSession.setActionHandler("pause", handlers.pause);
    navigator.mediaSession.setActionHandler("previoustrack", handlers.previous);
    navigator.mediaSession.setActionHandler("nexttrack", handlers.next);
  } catch {
    // ignore
  }
};

const updateMediaSessionState = (isPlaying: boolean) => {
  if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  } catch {
    // ignore
  }
};

const updateMediaSessionPosition = (position: number, duration: number) => {
  if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
  try {
    if (duration > 0 && "setPositionState" in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: 1,
        position: Math.min(position, duration),
      });
    }
  } catch {
    // ignore
  }
};

// ============================================
// Provider Component
// ============================================
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  // ============================================
  // Refs (Mutable, no re-render)
  // ============================================
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userIdRef = useRef<string | null>(null);
  const queueRef = useRef<Song[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isPreviewRef = useRef<boolean>(false);
  const previewDurationRef = useRef<number>(30);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================
  // State (Driven by Audio events)
  // ============================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [volume, setVolumeState] = useState(70);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // ============================================
  // Cleanup Helpers
  // ============================================
  const clearPreviewTimeout = useCallback(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        setProgress(audio.currentTime);
        updateMediaSessionPosition(audio.currentTime, audio.duration || 0);
      }
    }, 500);
  }, [stopProgressTracking]);

  // ============================================
  // Core: Load and Play Song (Synchronous Critical Path)
  // ============================================
  const loadAndPlaySong = useCallback(
    async (song: Song, index: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      clearPreviewTimeout();
      setIsLoading(true);
      setShowUpgradePrompt(false);

      try {
        const streamData = await getStreamUrl(song.id, userIdRef.current);

        // Update refs immediately (sync)
        isPreviewRef.current = streamData.isPreview;
        previewDurationRef.current = streamData.previewDuration || 30;

        // CRITICAL: Set src and play synchronously to maintain background session
        audio.src = streamData.url;
        
        // Play immediately (sync)
        const playPromise = audio.play();

        // Update React state after initiating play
        setCurrentSong(song);
        setCurrentIndex(index);
        currentIndexRef.current = index;
        setIsPreview(streamData.isPreview);

        // Handle play promise
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Play error:", error);
            // NotAllowedError: User interaction required
            if (error.name === "NotAllowedError") {
              console.warn("Autoplay blocked. User interaction required.");
            }
            setIsLoading(false);
          });
        }

        // Preview timeout
        if (streamData.isPreview && streamData.previewDuration) {
          previewTimeoutRef.current = setTimeout(() => {
            if (audio && isPreviewRef.current) {
              audio.pause();
              setShowUpgradePrompt(true);
            }
          }, streamData.previewDuration * 1000);
        }
      } catch (error) {
        console.error("Error loading song:", error);
        setIsLoading(false);
      }
    },
    [clearPreviewTimeout]
  );

  // ============================================
  // Actions
  // ============================================
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.src) {
      audio.play().catch(console.error);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused) {
        audio.play().catch(console.error);
      } else {
        audio.pause();
      }
    }
  }, []);

  const next = useCallback(() => {
    const currentQueue = queueRef.current;
    if (currentQueue.length === 0) return;

    const nextIndex = (currentIndexRef.current + 1) % currentQueue.length;
    const nextSong = currentQueue[nextIndex];

    if (nextSong) {
      // Update Media Session immediately for background continuity
      updateMediaSession(nextSong, { play, pause, next, previous: () => {} });
      updateMediaSessionState(true);

      loadAndPlaySong(nextSong, nextIndex);
    }
  }, [loadAndPlaySong, play, pause]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    const currentQueue = queueRef.current;
    if (currentQueue.length === 0) return;

    // If more than 3 seconds played, restart current song
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setProgress(0);
      return;
    }

    const prevIndex =
      currentIndexRef.current <= 0
        ? currentQueue.length - 1
        : currentIndexRef.current - 1;
    const prevSong = currentQueue[prevIndex];

    if (prevSong) {
      loadAndPlaySong(prevSong, prevIndex);
    }
  }, [loadAndPlaySong]);

  const playSong = useCallback(
    (song: Song, playlist?: Playlist, newQueue?: Song[]) => {
      const songQueue = newQueue || [song];
      const index = songQueue.findIndex((s) => s.id === song.id);
      const finalIndex = index >= 0 ? index : 0;

      // Update refs immediately
      queueRef.current = songQueue;
      currentIndexRef.current = finalIndex;

      // Update React state
      setQueue(songQueue);
      setCurrentPlaylist(playlist || null);

      loadAndPlaySong(song, finalIndex);
    },
    [loadAndPlaySong]
  );

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    const clampedVol = Math.max(0, Math.min(100, vol));
    if (audio) {
      audio.volume = clampedVol / 100;
    }
    setVolumeState(clampedVol);
    setIsMuted(clampedVol === 0);
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration > 0) {
      // Preview mode: prevent seeking beyond preview duration
      if (isPreviewRef.current && time > previewDurationRef.current) {
        return;
      }
      audio.currentTime = time;
      setProgress(time);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      const newMuted = !isMuted;
      audio.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const setUserId = useCallback((userId: string | null) => {
    userIdRef.current = userId;
  }, []);

  const dismissUpgradePrompt = useCallback(() => {
    setShowUpgradePrompt(false);
  }, []);

  const clearQueue = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    queueRef.current = [];
    currentIndexRef.current = -1;
    setQueue([]);
    setCurrentSong(null);
    setCurrentPlaylist(null);
    setCurrentIndex(-1);
    setProgress(0);
    setDuration(0);
    clearPreviewTimeout();
    stopProgressTracking();
  }, [clearPreviewTimeout, stopProgressTracking]);

  // ============================================
  // Audio Event Handlers (Single Source of Truth)
  // ============================================
  useEffect(() => {
    const audio = getAudio();
    audioRef.current = audio;
    audio.volume = volume / 100;

    // ============================================
    // Event: play - Audio started playing
    // ============================================
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      updateMediaSessionState(true);
      startProgressTracking();
    };

    // ============================================
    // Event: pause - Audio paused
    // ============================================
    const handlePause = () => {
      setIsPlaying(false);
      updateMediaSessionState(false);
      stopProgressTracking();
    };

    // ============================================
    // Event: ended - CRITICAL for background playback
    // ============================================
    const handleEnded = () => {
      console.log("Audio ended event fired");
      stopProgressTracking();
      clearPreviewTimeout();

      const currentQueue = queueRef.current;
      if (currentQueue.length === 0) return;

      const nextIndex = (currentIndexRef.current + 1) % currentQueue.length;
      const nextSong = currentQueue[nextIndex];

      if (nextSong) {
        // CRITICAL: Update Media Session IMMEDIATELY (sync)
        // This tells the OS "we're still playing" before it kills the session
        if ("mediaSession" in navigator) {
          try {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: nextSong.title,
              artist: nextSong.artist || "BizSound Stock",
              album: "BizSound Radio",
              artwork: [
                { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
                { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
              ],
            });
            navigator.mediaSession.playbackState = "playing";
          } catch {
            // ignore
          }
        }

        // Load next song
        currentIndexRef.current = nextIndex;
        loadAndPlaySong(nextSong, nextIndex);
      }
    };

    // ============================================
    // Event: loadedmetadata - Duration available
    // ============================================
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    // ============================================
    // Event: error - Handle playback errors
    // ============================================
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    // ============================================
    // Event: waiting - Buffering
    // ============================================
    const handleWaiting = () => {
      setIsLoading(true);
    };

    // ============================================
    // Event: canplay - Ready to play
    // ============================================
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // ============================================
    // Attach Event Listeners
    // ============================================
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    // Setup Media Session handlers
    updateMediaSession(null, { play, pause, next, previous });

    // ============================================
    // Cleanup
    // ============================================
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      stopProgressTracking();
      clearPreviewTimeout();
    };
  }, [
    volume,
    play,
    pause,
    next,
    previous,
    loadAndPlaySong,
    startProgressTracking,
    stopProgressTracking,
    clearPreviewTimeout,
  ]);

  // ============================================
  // Context Value
  // ============================================
  const value: PlayerContextType = {
    // State
    isPlaying,
    isLoading,
    currentSong,
    currentPlaylist,
    queue,
    currentIndex,
    volume,
    progress,
    duration,
    isMuted,
    isPreview,
    showUpgradePrompt,
    // Actions
    playSong,
    play,
    pause,
    toggle,
    next,
    previous,
    setVolume,
    seek,
    toggleMute,
    setUserId,
    dismissUpgradePrompt,
    clearQueue,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

// ============================================
// Hook
// ============================================
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}

// ============================================
// Selectors (for compatibility with existing code)
// ============================================
export const usePlayerState = () => {
  const player = usePlayer();
  return {
    isPlaying: player.isPlaying,
    isLoading: player.isLoading,
    currentSong: player.currentSong,
    currentPlaylist: player.currentPlaylist,
    queue: player.queue,
    currentIndex: player.currentIndex,
    volume: player.volume,
    progress: player.progress,
    duration: player.duration,
    isMuted: player.isMuted,
    isPreview: player.isPreview,
    showUpgradePrompt: player.showUpgradePrompt,
  };
};

export const usePlayerActions = () => {
  const player = usePlayer();
  return {
    playSong: player.playSong,
    play: player.play,
    pause: player.pause,
    toggle: player.toggle,
    next: player.next,
    previous: player.previous,
    setVolume: player.setVolume,
    seek: player.seek,
    toggleMute: player.toggleMute,
    setUserId: player.setUserId,
    dismissUpgradePrompt: player.dismissUpgradePrompt,
    clearQueue: player.clearQueue,
  };
};
