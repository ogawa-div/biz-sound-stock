import { create } from "zustand";
import type { Song } from "@/types/database";

interface SongsState {
  songs: Song[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchSongs: () => Promise<void>;
  reset: () => void;
}

// 直接fetch APIを使用（Supabaseクライアントに問題があるため）
async function fetchSongsFromSupabase(signal?: AbortSignal): Promise<Song[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/songs?select=*&order=created_at.desc`;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(url, {
    headers: {
      "apikey": apiKey || "",
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 現在のAbortController（キャンセル用）
let currentAbortController: AbortController | null = null;

export const useSongsStore = create<SongsState>((set, get) => ({
  songs: [],
  isLoading: false,
  hasFetched: false,
  error: null,

  fetchSongs: async () => {
    const { hasFetched, songs } = get();
    
    // 既に取得済みでデータがあればスキップ
    if (hasFetched && songs.length > 0) {
      console.log("[SongsStore] Using cached songs:", songs.length);
      return;
    }

    // 前のリクエストをキャンセル
    if (currentAbortController) {
      currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    set({ isLoading: true, error: null });
    console.log("[SongsStore] Fetching songs...");

    try {
      const data = await fetchSongsFromSupabase(currentAbortController.signal);
      console.log("[SongsStore] Fetched:", data.length, "songs");
      set({ songs: data, isLoading: false, hasFetched: true, error: null });
    } catch (error) {
      // AbortErrorは無視（正常なキャンセル）
      if (error instanceof Error && error.name === "AbortError") {
        console.log("[SongsStore] Request aborted");
        return;
      }
      console.error("[SongsStore] Error:", error);
      set({ 
        songs: [], 
        isLoading: false, 
        hasFetched: true, 
        error: error instanceof Error ? error.message : "Failed to fetch songs" 
      });
    }
  },

  reset: () => {
    set({ songs: [], isLoading: false, hasFetched: false, error: null });
  },
}));
