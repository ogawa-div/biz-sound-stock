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
  stop: () => void;
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

const updateMediaSessionMetadata = (song: Song | null) => {
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
  // Refs
  // ============================================
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userIdRef = useRef<string | null>(null);
  const queueRef = useRef<Song[]>([]);
  const currentIndexRef = useRef<number>(-1);
  const isPreviewRef = useRef<boolean>(false);
  const previewDurationRef = useRef<number>(30);
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Prefetch cache for next song
  const nextSongCacheRef = useRef<{
    songId: string;
    url: string;
    isPreview: boolean;
    previewDuration: number;
  } | null>(null);

  // ============================================
  // State
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
      if (audio && !audio.paused && audio.readyState >= 2) {
        setProgress(audio.currentTime);
        updateMediaSessionPosition(audio.currentTime, audio.duration || 0);
      }
    }, 500);
  }, [stopProgressTracking]);

  // ============================================
  // Prefetch Next Song
  // ============================================
  const prefetchNextSong = useCallback(async () => {
    const currentQueue = queueRef.current;
    if (currentQueue.length <= 1) return;

    const nextIndex = (currentIndexRef.current + 1) % currentQueue.length;
    const nextSong = currentQueue[nextIndex];

    if (!nextSong) return;
    if (nextSongCacheRef.current?.songId === nextSong.id) return;

    try {
      const streamData = await getStreamUrl(nextSong.id, userIdRef.current);
      nextSongCacheRef.current = {
        songId: nextSong.id,
        url: streamData.url,
        isPreview: streamData.isPreview,
        previewDuration: streamData.previewDuration || 30,
      };
    } catch (error) {
      console.error("Failed to prefetch:", error);
      nextSongCacheRef.current = null;
    }
  }, []);

  // ============================================
  // CORE: Play Track (Standard Implementation)
  // シンプルに audio.play() を呼ぶだけ
  // ============================================
  const playTrack = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    try {
      await audio.play();
      // isPlaying の更新は onPlay イベントリスナーで行われる
    } catch (error) {
      console.warn("Playback failed:", error);
      // 再生に失敗したら、UIを確実に「停止」に戻す
      setIsPlaying(false);
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    }
  }, []);

  // ============================================
  // Load and Play Song
  // ============================================
  const loadAndPlaySong = useCallback(
    async (song: Song, index: number, cachedStreamData?: { url: string; isPreview: boolean; previewDuration: number }) => {
      const audio = audioRef.current;
      if (!audio) return;

      clearPreviewTimeout();
      setIsLoading(true);
      setShowUpgradePrompt(false);

      try {
        const streamData = cachedStreamData || await getStreamUrl(song.id, userIdRef.current);

        isPreviewRef.current = streamData.isPreview;
        previewDurationRef.current = streamData.previewDuration || 30;

        setCurrentSong(song);
        setCurrentIndex(index);
        currentIndexRef.current = index;
        setIsPreview(streamData.isPreview);
        
        updateMediaSessionMetadata(song);

        // srcをセットしてロード
        audio.src = streamData.url;
        audio.load();
        
        // 再生
        try {
          await audio.play();
          prefetchNextSong();
        } catch (playError) {
          console.warn("Initial play failed:", playError);
          setIsLoading(false);
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
    [clearPreviewTimeout, prefetchNextSong]
  );

  // ============================================
  // Actions
  // ============================================
  const play = useCallback(() => {
    playTrack();
  }, [playTrack]);

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
        playTrack();
      } else {
        audio.pause();
      }
    }
  }, [playTrack]);

  const next = useCallback(() => {
    const currentQueue = queueRef.current;
    if (currentQueue.length === 0) return;

    const nextIndex = (currentIndexRef.current + 1) % currentQueue.length;
    const nextSong = currentQueue[nextIndex];

    if (nextSong) {
      const cache = nextSongCacheRef.current;
      if (cache && cache.songId === nextSong.id) {
        nextSongCacheRef.current = null;
        loadAndPlaySong(nextSong, nextIndex, {
          url: cache.url,
          isPreview: cache.isPreview,
          previewDuration: cache.previewDuration,
        });
      } else {
        loadAndPlaySong(nextSong, nextIndex);
      }
    }
  }, [loadAndPlaySong]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    const currentQueue = queueRef.current;
    if (currentQueue.length === 0) return;

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

      queueRef.current = songQueue;
      currentIndexRef.current = finalIndex;

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

  // 完全停止（Stop）: 再生を停止し、曲を解除してリセット
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    }
    
    // State をリセット
    queueRef.current = [];
    currentIndexRef.current = -1;
    nextSongCacheRef.current = null;
    
    setQueue([]);
    setCurrentSong(null);
    setCurrentPlaylist(null);
    setCurrentIndex(-1);
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
    setIsLoading(false);
    setIsPreview(false);
    setShowUpgradePrompt(false);
    
    clearPreviewTimeout();
    stopProgressTracking();
    
    // MediaSession をクリア
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
      } catch {
        // ignore
      }
    }
  }, [clearPreviewTimeout, stopProgressTracking]);

  // ============================================
  // Audio Event Handlers
  // ============================================
  useEffect(() => {
    const audio = getAudio();
    audioRef.current = audio;
    audio.volume = volume / 100;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      updateMediaSessionState(true);
      startProgressTracking();
    };

    const handlePause = () => {
      setIsPlaying(false);
      updateMediaSessionState(false);
      stopProgressTracking();
    };

    const handleEnded = () => {
      stopProgressTracking();
      clearPreviewTimeout();

      const currentQueue = queueRef.current;
      if (currentQueue.length === 0) return;

      const nextIndex = (currentIndexRef.current + 1) % currentQueue.length;
      const nextSong = currentQueue[nextIndex];

      if (!nextSong) return;

      updateMediaSessionMetadata(nextSong);

      const cache = nextSongCacheRef.current;
      if (cache && cache.songId === nextSong.id) {
        nextSongCacheRef.current = null;
        currentIndexRef.current = nextIndex;
        isPreviewRef.current = cache.isPreview;
        previewDurationRef.current = cache.previewDuration;

        setCurrentSong(nextSong);
        setCurrentIndex(nextIndex);
        setIsPreview(cache.isPreview);

        // 直接再生（エラーならリロード）
        audio.src = cache.url;
        audio.load();
        audio.play().then(() => {
          prefetchNextSong();
          if (cache.isPreview && cache.previewDuration) {
            previewTimeoutRef.current = setTimeout(() => {
              if (audio && isPreviewRef.current) {
                audio.pause();
                setShowUpgradePrompt(true);
              }
            }, cache.previewDuration * 1000);
          }
        }).catch((e) => {
          console.error("handleEnded play failed:", e);
        });
      } else {
        currentIndexRef.current = nextIndex;
        loadAndPlaySong(nextSong, nextIndex);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    // Event Listeners
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    // ============================================
    // MediaSession: Standard Handlers
    // ============================================
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", () => {
          playTrack();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          audio.pause();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          previous();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          next();
        });
      } catch {
        // ignore
      }
    }

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
    next,
    previous,
    loadAndPlaySong,
    playTrack,
    prefetchNextSong,
    startProgressTracking,
    stopProgressTracking,
    clearPreviewTimeout,
  ]);

  // ============================================
  // Context Value
  // ============================================
  const value: PlayerContextType = {
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
    stop,
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
// Selectors
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
    stop: player.stop,
  };
};
