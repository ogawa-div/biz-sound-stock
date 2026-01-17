// ===========================================
// Database Type Definitions
// Auto-generated types based on Supabase schema
// ===========================================

export type BusinessType =
  | "cafe"
  | "restaurant"
  | "salon"
  | "retail"
  | "hotel"
  | "gym"
  | "spa"
  | "other";

export type MusicGenre =
  | "jazz"
  | "pop"
  | "bossa_nova"
  | "classical"
  | "ambient"
  | "lounge"
  | "electronic"
  | "acoustic"
  | "world"
  | "r_and_b";

export type MusicMood =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "upbeat"
  | "relaxing"
  | "energetic"
  | "romantic"
  | "focus"
  | "celebration";

// Subscription types
export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "paused";

export type SubscriptionPlan = "free" | "premium" | "enterprise";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          business_type: BusinessType | null;
          business_name: string | null;
          is_admin: boolean;
          avatar_url: string | null;
          // Stripe連携
          stripe_customer_id: string | null;
          subscription_status: SubscriptionStatus | null;
          subscription_plan: SubscriptionPlan | null;
          trial_ends_at: string | null;
          // タイムスタンプ
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          business_type?: BusinessType | null;
          business_name?: string | null;
          is_admin?: boolean;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: SubscriptionStatus | null;
          subscription_plan?: SubscriptionPlan | null;
          trial_ends_at?: string | null;
        };
        Update: {
          display_name?: string | null;
          business_type?: BusinessType | null;
          business_name?: string | null;
          avatar_url?: string | null;
          stripe_customer_id?: string | null;
          subscription_status?: SubscriptionStatus | null;
          subscription_plan?: SubscriptionPlan | null;
          trial_ends_at?: string | null;
        };
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          album: string | null;
          file_key: string;
          cover_image_url: string | null;
          duration: number;
          genre: MusicGenre;
          mood: MusicMood;
          bpm: number | null;
          is_active: boolean;
          play_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          artist: string;
          album?: string | null;
          file_key: string;
          cover_image_url?: string | null;
          duration: number;
          genre: MusicGenre;
          mood: MusicMood;
          bpm?: number | null;
          is_active?: boolean;
        };
        Update: {
          title?: string;
          artist?: string;
          album?: string | null;
          file_key?: string;
          cover_image_url?: string | null;
          duration?: number;
          genre?: MusicGenre;
          mood?: MusicMood;
          bpm?: number | null;
          is_active?: boolean;
        };
      };
      playlists: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          is_public: boolean;
          is_featured: boolean;
          target_business_type: BusinessType[] | null;
          primary_genre: MusicGenre | null;
          primary_mood: MusicMood | null;
          total_duration: number;
          track_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          title: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_public?: boolean;
          is_featured?: boolean;
          target_business_type?: BusinessType[] | null;
          primary_genre?: MusicGenre | null;
          primary_mood?: MusicMood | null;
          created_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          cover_image_url?: string | null;
          is_public?: boolean;
          is_featured?: boolean;
          target_business_type?: BusinessType[] | null;
          primary_genre?: MusicGenre | null;
          primary_mood?: MusicMood | null;
        };
      };
      playlist_songs: {
        Row: {
          id: string;
          playlist_id: string;
          song_id: string;
          sort_order: number;
          added_at: string;
        };
        Insert: {
          playlist_id: string;
          song_id: string;
          sort_order?: number;
        };
        Update: {
          sort_order?: number;
        };
      };
      play_logs: {
        Row: {
          id: string;
          user_id: string;
          song_id: string;
          playlist_id: string | null;
          played_at: string;
          duration_played: number;
          completed: boolean;
        };
        Insert: {
          user_id: string;
          song_id: string;
          playlist_id?: string | null;
          duration_played?: number;
          completed?: boolean;
        };
        Update: {
          duration_played?: number;
          completed?: boolean;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          playlist_id: string | null;
          song_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          playlist_id?: string | null;
          song_id?: string | null;
        };
        Update: never;
      };
    };
    Views: {
      top_songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          genre: MusicGenre;
          mood: MusicMood;
          play_count: number;
          duration: number;
          cover_image_url: string | null;
        };
      };
      analytics_by_business_type: {
        Row: {
          business_type: BusinessType;
          genre: MusicGenre;
          mood: MusicMood;
          play_count: number;
          play_date: string;
        };
      };
    };
    Functions: {
      get_new_releases: {
        Args: { limit_count?: number };
        Returns: {
          id: string;
          title: string;
          description: string | null;
          cover_image_url: string | null;
          track_count: number;
          total_duration: number;
          created_at: string;
          primary_genre: MusicGenre | null;
          primary_mood: MusicMood | null;
        }[];
      };
    };
  };
}

// Utility types for easier usage
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Song = Database["public"]["Tables"]["songs"]["Row"];
export type Playlist = Database["public"]["Tables"]["playlists"]["Row"];
export type PlaylistSong = Database["public"]["Tables"]["playlist_songs"]["Row"];
export type PlayLog = Database["public"]["Tables"]["play_logs"]["Row"];
export type UserFavorite = Database["public"]["Tables"]["user_favorites"]["Row"];

// Insert types
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type SongInsert = Database["public"]["Tables"]["songs"]["Insert"];
export type PlaylistInsert = Database["public"]["Tables"]["playlists"]["Insert"];
export type PlayLogInsert = Database["public"]["Tables"]["play_logs"]["Insert"];

// Update types
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type SongUpdate = Database["public"]["Tables"]["songs"]["Update"];
export type PlaylistUpdate = Database["public"]["Tables"]["playlists"]["Update"];
