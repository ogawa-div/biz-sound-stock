import { create } from "zustand";
import { createBrowserClient } from "@supabase/ssr";
import type { Song } from "@/types/database";

interface SongsState {
  songs: Song[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;
  fetchSongs: () => Promise<void>;
  reset: () => void;
}

// 独立したSupabaseクライアント
function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

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

    set({ isLoading: true, error: null });
    console.log("[SongsStore] Fetching songs...");

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[SongsStore] Error:", error);
        set({ songs: [], isLoading: false, hasFetched: true, error: error.message });
      } else {
        console.log("[SongsStore] Fetched:", data?.length, "songs");
        set({ songs: data || [], isLoading: false, hasFetched: true, error: null });
      }
    } catch (error) {
      console.error("[SongsStore] Catch error:", error);
      set({ songs: [], isLoading: false, hasFetched: true, error: "Failed to fetch songs" });
    }
  },

  reset: () => {
    set({ songs: [], isLoading: false, hasFetched: false, error: null });
  },
}));
