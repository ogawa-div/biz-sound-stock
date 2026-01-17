import { getSupabaseClient } from "@/lib/supabase/client";
import type { Song, MusicGenre, MusicMood } from "@/types/database";

// ===========================================
// Song API Functions
// ===========================================

/**
 * Get all active songs
 */
export async function getAllSongs(): Promise<Song[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching songs:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get songs by genre
 */
export async function getSongsByGenre(genre: MusicGenre): Promise<Song[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_active", true)
    .eq("genre", genre)
    .order("play_count", { ascending: false });
  
  if (error) {
    console.error("Error fetching songs by genre:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get songs by mood
 */
export async function getSongsByMood(mood: MusicMood): Promise<Song[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_active", true)
    .eq("mood", mood)
    .order("play_count", { ascending: false });
  
  if (error) {
    console.error("Error fetching songs by mood:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get top songs by play count
 */
export async function getTopSongs(limit: number = 20): Promise<Song[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_active", true)
    .order("play_count", { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching top songs:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get a single song by ID
 */
export async function getSongById(id: string): Promise<Song | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching song:", error);
    return null;
  }
  
  return data;
}

/**
 * Search songs
 */
export async function searchSongs(query: string): Promise<Song[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_active", true)
    .or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`)
    .order("play_count", { ascending: false })
    .limit(50);
  
  if (error) {
    console.error("Error searching songs:", error);
    throw error;
  }
  
  return data || [];
}

// ===========================================
// Admin Song Functions
// ===========================================

/**
 * Create a new song (admin only)
 */
export async function createSong(
  song: {
    title: string;
    artist: string;
    album?: string;
    file_key: string;
    cover_image_url?: string;
    duration: number;
    genre: MusicGenre;
    mood: MusicMood;
    bpm?: number;
  }
): Promise<Song> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .insert(song)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating song:", error);
    throw error;
  }
  
  return data;
}

/**
 * Update a song (admin only)
 */
export async function updateSong(
  id: string,
  updates: Partial<Song>
): Promise<Song> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating song:", error);
    throw error;
  }
  
  return data;
}

/**
 * Soft delete a song (set is_active to false)
 */
export async function deleteSong(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from("songs")
    .update({ is_active: false })
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
}

/**
 * Get all songs including inactive (admin only)
 */
export async function getAllSongsAdmin(): Promise<Song[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching all songs:", error);
    throw error;
  }
  
  return data || [];
}
