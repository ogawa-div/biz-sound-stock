import { getSupabaseClient } from "@/lib/supabase/client";
import type { Playlist, Song } from "@/types/database";

// ===========================================
// Playlist API Functions
// ===========================================

/**
 * Get new releases - public playlists ordered by creation date
 */
export async function getNewReleases(limit: number = 6): Promise<Playlist[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching new releases:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get featured playlists
 */
export async function getFeaturedPlaylists(): Promise<Playlist[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("is_public", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching featured playlists:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get playlists by business type
 */
export async function getPlaylistsByBusinessType(
  businessType: string
): Promise<Playlist[]> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("is_public", true)
      .contains("target_business_type", [businessType])
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching playlists by business type:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching playlists by business type:", error);
    return [];
  }
}

/**
 * Get playlists by genre
 */
export async function getPlaylistsByGenre(genre: string): Promise<Playlist[]> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from("playlists")
      .select("*")
      .eq("is_public", true)
      .eq("primary_genre", genre)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching playlists by genre:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching playlists by genre:", error);
    return [];
  }
}

/**
 * Get playlists by mood
 */
export async function getPlaylistsByMood(mood: string): Promise<Playlist[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("is_public", true)
    .eq("primary_mood", mood)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching playlists by mood:", error);
    throw error;
  }
  
  return data || [];
}

/**
 * Get a single playlist by ID
 */
export async function getPlaylistById(id: string): Promise<Playlist | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }
  
  return data;
}

/**
 * Get songs in a playlist
 */
export async function getPlaylistSongs(playlistId: string): Promise<Song[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlist_songs")
    .select(`
      song_id,
      sort_order,
      songs (*)
    `)
    .eq("playlist_id", playlistId)
    .order("sort_order", { ascending: true });
  
  if (error) {
    console.error("Error fetching playlist songs:", error);
    throw error;
  }
  
  // Extract songs from the joined data
  return (data || []).map((item) => item.songs as unknown as Song);
}

/**
 * Search playlists
 */
export async function searchPlaylists(query: string): Promise<Playlist[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("is_public", true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(20);
  
  if (error) {
    console.error("Error searching playlists:", error);
    throw error;
  }
  
  return data || [];
}

// ===========================================
// Admin Playlist Functions
// ===========================================

/**
 * Create a new playlist (admin only)
 */
export async function createPlaylist(
  playlist: {
    title: string;
    description?: string;
    cover_image_url?: string;
    is_public?: boolean;
    is_featured?: boolean;
    target_business_type?: string[];
    primary_genre?: string;
    primary_mood?: string;
  }
): Promise<Playlist> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlists")
    .insert(playlist)
    .select()
    .single();
  
  if (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
  
  return data;
}

/**
 * Update a playlist (admin only)
 */
export async function updatePlaylist(
  id: string,
  updates: Partial<Playlist>
): Promise<Playlist> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("playlists")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating playlist:", error);
    throw error;
  }
  
  return data;
}

/**
 * Publish a playlist (set is_public to true)
 */
export async function publishPlaylist(id: string): Promise<Playlist> {
  return updatePlaylist(id, {
    is_public: true,
    published_at: new Date().toISOString(),
  });
}

/**
 * Unpublish a playlist (set is_public to false)
 */
export async function unpublishPlaylist(id: string): Promise<Playlist> {
  return updatePlaylist(id, { is_public: false });
}

/**
 * Delete a playlist (admin only)
 */
export async function deletePlaylist(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase.from("playlists").delete().eq("id", id);
  
  if (error) {
    console.error("Error deleting playlist:", error);
    throw error;
  }
}

/**
 * Add a song to a playlist
 */
export async function addSongToPlaylist(
  playlistId: string,
  songId: string,
  sortOrder?: number
): Promise<void> {
  const supabase = getSupabaseClient();
  
  // Get current max sort order if not provided
  if (sortOrder === undefined) {
    const { data: existingSongs } = await supabase
      .from("playlist_songs")
      .select("sort_order")
      .eq("playlist_id", playlistId)
      .order("sort_order", { ascending: false })
      .limit(1);
    
    sortOrder = existingSongs && existingSongs.length > 0
      ? existingSongs[0].sort_order + 1
      : 0;
  }
  
  const { error } = await supabase.from("playlist_songs").insert({
    playlist_id: playlistId,
    song_id: songId,
    sort_order: sortOrder,
  });
  
  if (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
}

/**
 * Remove a song from a playlist
 */
export async function removeSongFromPlaylist(
  playlistId: string,
  songId: string
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", songId);
  
  if (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
}

/**
 * Reorder songs in a playlist
 */
export async function reorderPlaylistSongs(
  playlistId: string,
  songIds: string[]
): Promise<void> {
  const supabase = getSupabaseClient();
  
  // Update each song's sort order
  const updates = songIds.map((songId, index) =>
    supabase
      .from("playlist_songs")
      .update({ sort_order: index })
      .eq("playlist_id", playlistId)
      .eq("song_id", songId)
  );
  
  await Promise.all(updates);
}
