import { create } from "zustand";
import { Howl, Howler } from "howler";
import type { Song, Playlist } from "@/types/database";

// バックグラウンド再生のため、Web Audio APIを無効化してHTML5 Audioのみ使用
if (typeof window !== "undefined") {
  Howler.usingWebAudio = false;
  
  // バックグラウンドから復帰時のチェック
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // フォアグラウンドに復帰した時、曲が終わっていたら次へ
      const state = usePlayerStore.getState();
      const { howl, duration, isPlaying, queue, next } = state;
      
      if (howl && isPlaying && duration > 0) {
        const currentPos = howl.seek() as number;
        // 曲の終端に達していたら次へ
        if (currentPos >= duration - 1) {
          console.log("Visibility change: Song ended while in background");
          if (queue.length > 0) {
            next();
          }
        }
      }
    }
  });
}

interface PlayerState {
  isPlaying: boolean;
  isLoading: boolean; // ロード中フラグ（連打防止）
  currentSong: Song | null;
  currentPlaylist: Playlist | null;
  queue: Song[];
  currentIndex: number;
  volume: number;
  progress: number;
  duration: number;
  isMuted: boolean;
  howl: Howl | null;
  isPreview: boolean;
  previewDuration: number;
  showUpgradePrompt: boolean;
  userId: string | null;
  
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setPlaylist: (playlist: Playlist, songs: Song[]) => void;
  playSong: (song: Song, playlist?: Playlist, queue?: Song[]) => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  setVolume: (volume: number) => void;
  seek: (progress: number) => void;
  toggleMute: () => void;
  setUserId: (userId: string | null) => void;
  dismissUpgradePrompt: () => void;
  _updateProgress: () => void;
  _loadSong: (song: Song) => void;
  _cleanup: () => void;
}

interface StreamResponse {
  url: string;
  isPreview: boolean;
  previewDuration?: number;
  expiresAt: number;
}

const getStreamUrl = async (songId: string, userId: string | null): Promise<StreamResponse> => {
  const response = await fetch("/api/songs/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ songId, userId }),
  });
  if (!response.ok) throw new Error("Failed to get stream URL");
  return response.json();
};

// Media Session API: ロック画面・通知センターでの再生コントロール
const setupMediaSession = (
  song: Song,
  handlers: {
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
  }
) => {
  if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist || "BizSound Stock",
      album: "BizSound Radio",
      artwork: [
        { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
        { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", handlers.play);
    navigator.mediaSession.setActionHandler("pause", handlers.pause);
    navigator.mediaSession.setActionHandler("previoustrack", handlers.previous);
    navigator.mediaSession.setActionHandler("nexttrack", handlers.next);
  } catch (error) {
    console.warn("Media Session API not supported:", error);
  }
};

// Media Session の再生状態を更新
const updateMediaSessionState = (isPlaying: boolean) => {
  if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
  try {
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  } catch {
    // ignore
  }
};

// Media Session の再生位置を更新（バックグラウンドでOSに状態を通知）
const updateMediaSessionPosition = (position: number, duration: number) => {
  if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
  try {
    if (duration > 0 && "setPositionState" in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: duration,
        playbackRate: 1,
        position: Math.min(position, duration),
      });
    }
  } catch {
    // ignore - some browsers don't support setPositionState
  }
};

export const usePlayerStore = create<PlayerState>((set, get) => {
  let progressInterval: ReturnType<typeof setInterval> | null = null;
  let previewTimeout: ReturnType<typeof setTimeout> | null = null;

  const startProgressTracking = () => {
    if (progressInterval) clearInterval(progressInterval);
    // バックグラウンドでも動作するよう500msごとに更新
    progressInterval = setInterval(() => {
      const state = get();
      state._updateProgress();
      
      // フォールバック: onendが発火しない場合の曲終了検知
      const { howl, duration, progress, isPlaying, queue, currentIndex, next } = state;
      if (howl && isPlaying && duration > 0 && progress >= duration - 0.5) {
        // 曲の終端に達した場合、手動で次へ
        console.log("Fallback: Song ended, moving to next");
        if (queue.length > 0) {
          next();
        }
      }
    }, 500);
  };

  const stopProgressTracking = () => {
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
  };

  const clearPreviewTimeout = () => {
    if (previewTimeout) { clearTimeout(previewTimeout); previewTimeout = null; }
  };

  return {
    isPlaying: false,
    isLoading: false,
    currentSong: null,
    currentPlaylist: null,
    queue: [],
    currentIndex: -1,
    volume: 70,
    progress: 0,
    duration: 0,
    isMuted: false,
    howl: null,
    isPreview: false,
    previewDuration: 30,
    showUpgradePrompt: false,
    userId: null,

    setUserId: (userId) => set({ userId }),
    dismissUpgradePrompt: () => set({ showUpgradePrompt: false }),

    play: () => {
      const { howl, currentSong, _loadSong } = get();
      if (!currentSong) return;
      if (howl) { howl.play(); set({ isPlaying: true }); startProgressTracking(); }
      else { _loadSong(currentSong); }
    },

    pause: () => {
      const { howl } = get();
      if (howl) { howl.pause(); set({ isPlaying: false }); stopProgressTracking(); }
    },

    toggle: () => {
      const { isPlaying, play, pause } = get();
      isPlaying ? pause() : play();
    },

    next: () => {
      const { queue, currentIndex, _loadSong, _cleanup, isLoading } = get();
      // ロード中は連打を無視
      if (isLoading) return;
      if (queue.length === 0) return;
      
      // 先に現在の再生を完全に停止
      _cleanup();
      clearPreviewTimeout();
      
      const nextIndex = (currentIndex + 1) % queue.length;
      set({ currentIndex: nextIndex, currentSong: queue[nextIndex], showUpgradePrompt: false });
      _loadSong(queue[nextIndex]);
    },

    previous: () => {
      const { queue, currentIndex, _loadSong, _cleanup, progress, howl, isLoading } = get();
      // ロード中は連打を無視
      if (isLoading) return;
      if (queue.length === 0) return;
      
      // 3秒以上再生していたら曲の最初に戻る
      if (progress > 3) { 
        if (howl) { howl.seek(0); set({ progress: 0 }); } 
        return; 
      }
      
      // 先に現在の再生を完全に停止
      _cleanup();
      clearPreviewTimeout();
      
      const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
      set({ currentIndex: prevIndex, currentSong: queue[prevIndex], showUpgradePrompt: false });
      _loadSong(queue[prevIndex]);
    },

    setPlaylist: (playlist, songs) => {
      const { _cleanup, _loadSong } = get();
      _cleanup(); clearPreviewTimeout();
      if (songs.length === 0) return;
      set({ currentPlaylist: playlist, queue: songs, currentIndex: 0, currentSong: songs[0], showUpgradePrompt: false });
      _loadSong(songs[0]);
    },

    playSong: (song, playlist, queue) => {
      const { _cleanup, _loadSong } = get();
      _cleanup(); clearPreviewTimeout();
      const newQueue = queue || [song];
      const index = newQueue.findIndex((s) => s.id === song.id);
      set({ currentSong: song, currentPlaylist: playlist || null, queue: newQueue, currentIndex: index >= 0 ? index : 0, showUpgradePrompt: false });
      _loadSong(song);
    },

    addToQueue: (song) => set((state) => ({ queue: [...state.queue, song] })),

    clearQueue: () => {
      get()._cleanup(); clearPreviewTimeout();
      set({ queue: [], currentIndex: -1, currentSong: null, currentPlaylist: null, showUpgradePrompt: false });
    },

    setVolume: (volume) => {
      const { howl } = get();
      const v = Math.max(0, Math.min(100, volume));
      if (howl) howl.volume(v / 100);
      set({ volume: v, isMuted: v === 0 });
    },

    seek: (progress) => {
      const { howl, duration, isPreview, previewDuration } = get();
      if (howl && duration > 0) {
        const seekTime = (progress / 100) * duration;
        if (isPreview && seekTime > previewDuration) return;
        howl.seek(seekTime);
        set({ progress: seekTime });
      }
    },

    toggleMute: () => {
      const { howl, isMuted, volume } = get();
      if (howl) howl.volume(isMuted ? volume / 100 : 0);
      set({ isMuted: !isMuted });
    },

    _updateProgress: () => {
      const { howl, duration } = get();
      if (howl && howl.playing()) {
        const currentPos = howl.seek() as number;
        set({ progress: currentPos });
        // バックグラウンドでもOSに再生位置を通知
        updateMediaSessionPosition(currentPos, duration);
      }
    },

    _loadSong: async (song) => {
      const { _cleanup, volume, next, userId, howl: oldHowl } = get();
      
      // 古いオーディオを確実に停止（二重再生防止）
      if (oldHowl) {
        oldHowl.stop();
        oldHowl.unload();
      }
      stopProgressTracking();
      clearPreviewTimeout();
      
      // ロード開始
      set({ isLoading: true, howl: null, progress: 0, duration: 0 });

      try {
        const streamData = await getStreamUrl(song.id, userId);
        
        // ロード中に別の曲が選択された場合、この曲の再生をキャンセル
        const currentState = get();
        if (currentState.currentSong?.id !== song.id) {
          set({ isLoading: false });
          return;
        }
        
        set({ isPreview: streamData.isPreview, previewDuration: streamData.previewDuration || 30 });

        const newHowl = new Howl({
          src: [streamData.url],
          html5: true, // バックグラウンド再生に必須
          preload: true, // 事前にロード
          volume: volume / 100,
          onplay: () => {
            set({ isPlaying: true, isLoading: false, duration: newHowl.duration() });
            updateMediaSessionState(true);
            startProgressTracking();
            if (streamData.isPreview && streamData.previewDuration) {
              previewTimeout = setTimeout(() => {
                const { howl } = get();
                if (howl === newHowl) { // このHowlインスタンスがまだ現在のものか確認
                  howl.pause(); 
                  set({ isPlaying: false, showUpgradePrompt: true }); 
                  updateMediaSessionState(false);
                  stopProgressTracking(); 
                }
              }, streamData.previewDuration * 1000);
            }
          },
          onpause: () => { 
            set({ isPlaying: false }); 
            updateMediaSessionState(false);
            stopProgressTracking(); 
          },
          onend: () => { 
            const currentState = get();
            if (currentState.howl === newHowl) {
              // バックグラウンド対策: 即座にnextを呼び出す
              // setTimeoutを使わず同期的に処理してOSの割り込みを防ぐ
              stopProgressTracking(); 
              clearPreviewTimeout();
              
              // 次の曲の情報を先にセットしてOSに通知
              const { queue, currentIndex } = currentState;
              if (queue.length > 0) {
                const nextIndex = (currentIndex + 1) % queue.length;
                const nextSong = queue[nextIndex];
                
                // 即座にMedia Sessionを更新してOSに「まだ再生中」と伝える
                if (nextSong && "mediaSession" in navigator) {
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
              }
              
              // 次の曲へ遷移
              next();
            }
          },
          onload: () => set({ duration: newHowl.duration() }),
          onloaderror: (_, error) => { 
            console.error("Error loading audio:", error); 
            set({ isPlaying: false, isLoading: false }); 
          },
          onplayerror: () => {
            // 再生エラー時のリカバリー（バックグラウンド復帰時など）
            console.warn("Play error, attempting to recover...");
            newHowl.once("unlock", () => {
              newHowl.play();
            });
          },
        });
        
        // バックグラウンド再生対策: 内部のHTML Audio要素に直接endedイベントを追加
        // Howler.jsのonendがバックグラウンドで発火しない場合のフォールバック
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sounds = (newHowl as any)._sounds;
          if (sounds && sounds.length > 0) {
            const audioNode = sounds[0]._node;
            if (audioNode && audioNode instanceof HTMLAudioElement) {
              audioNode.addEventListener("ended", () => {
                const currentState = get();
                // Howlのonendがすでに処理した場合はスキップ
                if (currentState.howl !== newHowl || currentState.isLoading) return;
                
                console.log("Native ended event fired");
                stopProgressTracking();
                clearPreviewTimeout();
                next();
              }, { once: true });
            }
          }
        } catch {
          // Internal API access failed, rely on Howler's onend
        }
        
        // Media Session API の設定（ロック画面対応）
        const { play, pause, next: nextTrack, previous: prevTrack } = get();
        setupMediaSession(song, {
          play,
          pause,
          next: nextTrack,
          previous: prevTrack,
        });
        
        // 再度確認：ロード完了時にまだこの曲が選択されているか
        const finalState = get();
        if (finalState.currentSong?.id !== song.id) {
          newHowl.unload();
          set({ isLoading: false });
          return;
        }
        
        set({ howl: newHowl, progress: 0 });
        newHowl.play();
      } catch (error) {
        console.error("Error loading song:", error);
        set({ isPlaying: false, isLoading: false });
      }
    },

    _cleanup: () => {
      const { howl } = get();
      stopProgressTracking(); 
      clearPreviewTimeout();
      if (howl) { 
        howl.stop(); 
        howl.unload(); 
      }
      set({ howl: null, progress: 0, duration: 0, isPlaying: false });
    },
  };
});

export const selectIsPlaying = (state: PlayerState) => state.isPlaying;
export const selectIsLoading = (state: PlayerState) => state.isLoading;
export const selectCurrentSong = (state: PlayerState) => state.currentSong;
export const selectCurrentPlaylist = (state: PlayerState) => state.currentPlaylist;
export const selectVolume = (state: PlayerState) => state.volume;
export const selectProgress = (state: PlayerState) => state.progress;
export const selectDuration = (state: PlayerState) => state.duration;
export const selectIsMuted = (state: PlayerState) => state.isMuted;
export const selectIsPreview = (state: PlayerState) => state.isPreview;
export const selectShowUpgradePrompt = (state: PlayerState) => state.showUpgradePrompt;
