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

// Safari/iOS検出
const isSafari = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome/.test(ua);
};

const isIOS = (): boolean => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
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
  // NEW: Race Condition 対策用 Refs
  // ============================================
  // Play操作が進行中かどうかのフラグ (AbortError防止)
  const isPlayPendingRef = useRef<boolean>(false);
  // 現在のPlay Promise (競合検出用)
  const currentPlayPromiseRef = useRef<Promise<void> | null>(null);
  // src変更中フラグ (意図しないpauseイベント無視用)
  const isChangingSourceRef = useRef<boolean>(false);
  
  // Prefetch cache for next song (CRITICAL for background playback)
  const nextSongCacheRef = useRef<{
    songId: string;
    url: string;
    isPreview: boolean;
    previewDuration: number;
  } | null>(null);

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

  // ============================================
  // MODIFIED: Progress Tracking with strict validation
  // ============================================
  const lastProgressRef = useRef<number>(0);
  const stuckCountRef = useRef<number>(0);
  
  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    lastProgressRef.current = 0;
    stuckCountRef.current = 0;
    
    progressIntervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      
      // 基本条件: 再生中 かつ データ準備完了
      if (audio && !audio.paused && audio.readyState >= 3) {
        const currentTime = audio.currentTime;
        
        // Safari PWA対策: 時間が進んでいるかチェック
        if (Math.abs(currentTime - lastProgressRef.current) < 0.01) {
          // 時間が進んでいない
          stuckCountRef.current++;
          
          if (stuckCountRef.current >= 3) {
            // 3回連続で進んでいない = サイレント状態の可能性
            console.log("Progress stuck, audio may be silent");
            // UIを一時停止状態に同期（ユーザーに再度押させる）
            setIsPlaying(false);
            updateMediaSessionState(false);
            stopProgressTracking();
            return;
          }
        } else {
          // 正常に進んでいる
          stuckCountRef.current = 0;
        }
        
        lastProgressRef.current = currentTime;
        setProgress(currentTime);
        updateMediaSessionPosition(currentTime, audio.duration || 0);
      }
    }, 500);
  }, [stopProgressTracking]);

  // ============================================
  // Prefetch Next Song (CRITICAL for background playback)
  // ============================================
  const prefetchNextSong = useCallback(async () => {
    const currentQueue = queueRef.current;
    if (currentQueue.length <= 1) return;

    const nextIndex = (currentIndexRef.current + 1) % currentQueue.length;
    const nextSong = currentQueue[nextIndex];

    if (!nextSong) return;

    // Skip if already cached
    if (nextSongCacheRef.current?.songId === nextSong.id) return;

    try {
      console.log("Prefetching next song:", nextSong.title);
      const streamData = await getStreamUrl(nextSong.id, userIdRef.current);
      nextSongCacheRef.current = {
        songId: nextSong.id,
        url: streamData.url,
        isPreview: streamData.isPreview,
        previewDuration: streamData.previewDuration || 30,
      };
      console.log("Next song prefetched successfully");
    } catch (error) {
      console.error("Failed to prefetch next song:", error);
      nextSongCacheRef.current = null;
    }
  }, []);

  // ============================================
  // NEW: Safe Play Method (Race Condition対策 + Safari PWA対策)
  // ============================================
  const safePlay = useCallback(async (newSrc?: string): Promise<boolean> => {
    const audio = audioRef.current;
    if (!audio) return false;

    // 既にplay操作が進行中なら待機
    if (isPlayPendingRef.current && currentPlayPromiseRef.current) {
      console.log("Play already pending, waiting...");
      try {
        await currentPlayPromiseRef.current;
      } catch {
        // 前のPromiseがエラーでも続行
      }
    }

    isPlayPendingRef.current = true;

    try {
      // 新しいsrcがある場合
      if (newSrc) {
        // src変更中フラグを立てる（pauseイベント無視用）
        isChangingSourceRef.current = true;
        
        audio.src = newSrc;
        
        // Safari用: 明示的にloadを呼び、canplay を待つ
        await new Promise<void>((resolve, reject) => {
          const onCanPlay = () => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
            resolve();
          };
          const onError = (e: Event) => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
            reject(new Error(`Load error: ${e}`));
          };
          
          audio.addEventListener("canplay", onCanPlay, { once: true });
          audio.addEventListener("error", onError, { once: true });
          
          audio.load();
          
          // タイムアウト (10秒)
          setTimeout(() => {
            audio.removeEventListener("canplay", onCanPlay);
            audio.removeEventListener("error", onError);
            resolve();
          }, 10000);
        });
        
        isChangingSourceRef.current = false;
      } else if (audio.src && (isSafari() || isIOS())) {
        // ============================================
        // Safari PWA 対策: 既存srcでの再生再開時
        // バックグラウンドからの復帰でオーディオセッションが
        // サスペンドされている場合、強制的にリフレッシュする
        // ============================================
        console.log("safePlay: Safari/iOS detected, refreshing audio session");
        
        const currentTime = audio.currentTime;
        const currentSrc = audio.src;
        
        // Safari用トリック1: currentTimeを再設定してストリームを起こす
        audio.currentTime = currentTime;
        
        // それでもダメな場合に備えて、再生後に監視する
        const playPromise = audio.play();
        currentPlayPromiseRef.current = playPromise;
        
        await playPromise;
        
        // Safari PWA対策: 再生が実際に機能しているか確認
        // 500ms後にcurrentTimeが変化していなければ、強制リロード
        await new Promise<void>((resolve) => {
          const checkTime = audio.currentTime;
          setTimeout(async () => {
            // 時間が全く進んでいない、かつ再生中のはず = 実際には再生されていない
            if (!audio.paused && Math.abs(audio.currentTime - checkTime) < 0.1) {
              console.log("safePlay: Audio stuck, forcing reload");
              
              // 強制リロード
              isChangingSourceRef.current = true;
              audio.src = "";
              audio.src = currentSrc;
              audio.load();
              
              // canplay待機
              await new Promise<void>((res) => {
                const onReady = () => {
                  audio.removeEventListener("canplay", onReady);
                  res();
                };
                audio.addEventListener("canplay", onReady, { once: true });
                setTimeout(() => {
                  audio.removeEventListener("canplay", onReady);
                  res();
                }, 5000);
              });
              
              // 元の位置にシーク
              audio.currentTime = currentTime;
              isChangingSourceRef.current = false;
              
              // 再度再生
              try {
                await audio.play();
                console.log("safePlay: Forced reload successful");
              } catch (e) {
                console.error("safePlay: Forced reload failed:", e);
              }
            }
            resolve();
          }, 500);
        });
        
        console.log("safePlay: Safari playback started successfully");
        return true;
      }

      // 通常の再生実行
      const playPromise = audio.play();
      currentPlayPromiseRef.current = playPromise;

      await playPromise;
      console.log("safePlay: Playback started successfully");
      return true;
      
    } catch (error: unknown) {
      const err = error as Error;
      
      // AbortError: Safariで別の操作が割り込んだ場合（無視してOK）
      if (err.name === "AbortError") {
        console.log("safePlay: AbortError (interrupted, ignoring)");
        return false;
      }
      
      // NotAllowedError: ユーザー操作が必要
      if (err.name === "NotAllowedError") {
        console.warn("safePlay: NotAllowedError - User interaction required");
        // UIを停止状態に戻す（ユーザーに再度押させるため）
        setIsPlaying(false);
        updateMediaSessionState(false);
        return false;
      }
      
      console.error("safePlay: Playback failed:", err);
      return false;
      
    } finally {
      isPlayPendingRef.current = false;
      currentPlayPromiseRef.current = null;
      isChangingSourceRef.current = false;
    }
  }, []);

  // ============================================
  // Core: Load and Play Song (MODIFIED: safePlay使用)
  // ============================================
  const loadAndPlaySong = useCallback(
    async (song: Song, index: number, cachedStreamData?: { url: string; isPreview: boolean; previewDuration: number }) => {
      const audio = audioRef.current;
      if (!audio) return;

      clearPreviewTimeout();
      setIsLoading(true);
      setShowUpgradePrompt(false);

      try {
        // Use cached data if available, otherwise fetch
        const streamData = cachedStreamData || await getStreamUrl(song.id, userIdRef.current);

        // Update refs immediately (sync)
        isPreviewRef.current = streamData.isPreview;
        previewDurationRef.current = streamData.previewDuration || 30;

        // Update React state
        setCurrentSong(song);
        setCurrentIndex(index);
        currentIndexRef.current = index;
        setIsPreview(streamData.isPreview);
        
        // Update Media Session metadata
        updateMediaSessionMetadata(song);

        // MODIFIED: safePlayを使用して再生
        const success = await safePlay(streamData.url);

        if (success) {
          // Prefetch next song after current song starts playing
          prefetchNextSong();

          // Preview timeout
          if (streamData.isPreview && streamData.previewDuration) {
            previewTimeoutRef.current = setTimeout(() => {
              if (audio && isPreviewRef.current) {
                audio.pause();
                setShowUpgradePrompt(true);
              }
            }, streamData.previewDuration * 1000);
          }
        }
        
      } catch (error) {
        console.error("Error loading song:", error);
        setIsLoading(false);
      }
    },
    [clearPreviewTimeout, prefetchNextSong, safePlay]
  );

  // ============================================
  // Actions (MODIFIED: safePlay使用)
  // ============================================
  const play = useCallback(() => {
    safePlay();
  }, [safePlay]);

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
        safePlay();
      } else {
        audio.pause();
      }
    }
  }, [safePlay]);

  const next = useCallback(() => {
    const currentQueue = queueRef.current;
    if (currentQueue.length === 0) return;

    const nextIndex = (currentIndexRef.current + 1) % currentQueue.length;
    const nextSong = currentQueue[nextIndex];

    if (nextSong) {
      // Check for cached URL
      const cache = nextSongCacheRef.current;
      if (cache && cache.songId === nextSong.id) {
        nextSongCacheRef.current = null; // Clear cache
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
    // MODIFIED: src変更中やseeking中は無視
    // ============================================
    const handlePause = () => {
      // src変更中の場合は無視（曲切り替え時の一瞬のpause）
      if (isChangingSourceRef.current) {
        console.log("handlePause: Ignoring (source changing)");
        return;
      }
      
      // シーク中の場合も無視
      if (audio.seeking) {
        console.log("handlePause: Ignoring (seeking)");
        return;
      }
      
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

      if (!nextSong) return;

      // Update Media Session metadata immediately
      updateMediaSessionMetadata(nextSong);

      // Check if we have prefetched data for the next song
      const cache = nextSongCacheRef.current;
      const hasCachedUrl = cache && cache.songId === nextSong.id;

      if (hasCachedUrl) {
        console.log("Using cached URL for next song");
        nextSongCacheRef.current = null;
        
        // Update refs
        currentIndexRef.current = nextIndex;
        isPreviewRef.current = cache.isPreview;
        previewDurationRef.current = cache.previewDuration;

        // Update React state
        setCurrentSong(nextSong);
        setCurrentIndex(nextIndex);
        setIsPreview(cache.isPreview);

        // Use safePlay with cached URL
        safePlay(cache.url).then((success) => {
          if (success) {
            prefetchNextSong();
            
            if (cache.isPreview && cache.previewDuration) {
              previewTimeoutRef.current = setTimeout(() => {
                if (audio && isPreviewRef.current) {
                  audio.pause();
                  setShowUpgradePrompt(true);
                }
              }, cache.previewDuration * 1000);
            }
          }
        });
      } else {
        console.log("No cache available, loading next song");
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

    // ============================================
    // Setup Media Session handlers (MODIFIED: safePlay使用)
    // ============================================
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", () => {
          console.log("MediaSession: play action");
          safePlay();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          console.log("MediaSession: pause action");
          audio.pause();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          console.log("MediaSession: previous action");
          previous();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          console.log("MediaSession: next action");
          next();
        });
      } catch {
        // ignore
      }
    }

    // ============================================
    // visibilitychange: バックグラウンドからの復帰検知
    // Safari PWA対策: 復帰時にオーディオ状態を同期
    // ============================================
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("App became visible, checking audio state");
        
        // オーディオの実際の状態とReact状態を同期
        const audioActuallyPlaying = !audio.paused;
        
        // Safari PWA: "再生中"のはずなのに音が出ていない可能性をチェック
        if (audioActuallyPlaying && (isSafari() || isIOS())) {
          // 500ms後にcurrentTimeが進んでいるか確認
          const checkTime = audio.currentTime;
          setTimeout(() => {
            if (!audio.paused && Math.abs(audio.currentTime - checkTime) < 0.1) {
              // 時間が進んでいない = サイレント状態
              console.log("visibilityChange: Audio silent, updating UI to paused");
              setIsPlaying(false);
              updateMediaSessionState(false);
              stopProgressTracking();
            }
          }, 500);
        }
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);

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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopProgressTracking();
      clearPreviewTimeout();
    };
  }, [
    volume,
    next,
    previous,
    loadAndPlaySong,
    safePlay,
    prefetchNextSong,
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
