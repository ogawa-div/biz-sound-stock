import { create } from "zustand";
import { Howl } from "howler";
import type { Song, Playlist } from "@/types/database";

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

export const usePlayerStore = create<PlayerState>((set, get) => {
  let progressInterval: ReturnType<typeof setInterval> | null = null;
  let previewTimeout: ReturnType<typeof setTimeout> | null = null;

  const startProgressTracking = () => {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => get()._updateProgress(), 1000);
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
      const { howl } = get();
      if (howl && howl.playing()) set({ progress: howl.seek() as number });
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
          html5: true,
          volume: volume / 100,
          onplay: () => {
            set({ isPlaying: true, isLoading: false, duration: newHowl.duration() });
            startProgressTracking();
            if (streamData.isPreview && streamData.previewDuration) {
              previewTimeout = setTimeout(() => {
                const { howl } = get();
                if (howl === newHowl) { // このHowlインスタンスがまだ現在のものか確認
                  howl.pause(); 
                  set({ isPlaying: false, showUpgradePrompt: true }); 
                  stopProgressTracking(); 
                }
              }, streamData.previewDuration * 1000);
            }
          },
          onpause: () => { set({ isPlaying: false }); stopProgressTracking(); },
          onend: () => { 
            const { howl } = get();
            if (howl === newHowl) { // このHowlインスタンスがまだ現在のものか確認
              stopProgressTracking(); 
              clearPreviewTimeout(); 
              next(); 
            }
          },
          onload: () => set({ duration: newHowl.duration() }),
          onloaderror: (_, error) => { 
            console.error("Error loading audio:", error); 
            set({ isPlaying: false, isLoading: false }); 
          },
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
