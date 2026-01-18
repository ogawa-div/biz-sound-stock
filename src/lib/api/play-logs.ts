import { getSupabaseClient } from "@/lib/supabase/client";
import type { PlayLogInsert } from "@/types/database";

// ===========================================
// Play Log API Functions
// ===========================================

/**
 * Log a play event
 * Called when a song has been played for more than 30 seconds
 */
export async function logPlay(
  userId: string,
  songId: string,
  playlistId?: string,
  durationPlayed: number = 0,
  completed: boolean = false
): Promise<void> {
  const supabase = getSupabaseClient();
  
  const playLog: PlayLogInsert = {
    user_id: userId,
    song_id: songId,
    playlist_id: playlistId || null,
    duration_played: durationPlayed,
    completed,
  };
  
  const { error } = await supabase.from("play_logs").insert(playLog);
  
  if (error) {
    console.error("Error logging play:", error);
    // Don't throw - logging shouldn't break the user experience
  }
}

// ===========================================
// Analytics Functions (Admin)
// ===========================================

/**
 * Get total play count for a date range
 */
export async function getTotalPlayCount(
  startDate: Date,
  endDate: Date
): Promise<number> {
  const supabase = getSupabaseClient();
  
  const { count, error } = await supabase
    .from("play_logs")
    .select("*", { count: "exact", head: true })
    .gte("played_at", startDate.toISOString())
    .lte("played_at", endDate.toISOString());
  
  if (error) {
    console.error("Error getting play count:", error);
    throw error;
  }
  
  return count || 0;
}

// Types for analytics
type SongCount = { song_id: string; title: string; artist: string; play_count: number };
type BusinessTypeCount = { business_type: string; play_count: number };
type GenreCount = { genre: string; play_count: number };
type BusinessGenreCount = { business_type: string; genre: string; play_count: number };
type DateCount = { date: string; play_count: number };

type PlayLogWithSongs = { song_id: string; songs: unknown };
type PlayLogWithProfiles = { profiles: unknown };
type PlayLogWithSongsAndProfiles = { songs: unknown; profiles: unknown };
type PlayLogWithDate = { played_at: string };

/**
 * Get top songs by play count for a date range
 */
export async function getTopSongsAnalytics(
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<SongCount[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("play_logs")
    .select(`
      song_id,
      songs!inner(title, artist)
    `)
    .gte("played_at", startDate.toISOString())
    .lte("played_at", endDate.toISOString());
  
  if (error) {
    console.error("Error getting top songs:", error);
    throw error;
  }
  
  // Aggregate by song
  const songCounts = (data as PlayLogWithSongs[] || []).reduce(
    (acc: Record<string, SongCount>, log: PlayLogWithSongs) => {
      const songId = log.song_id;
      if (!acc[songId]) {
        const song = log.songs as { title: string; artist: string } | null;
        acc[songId] = {
          song_id: songId,
          title: song?.title || "Unknown",
          artist: song?.artist || "Unknown",
          play_count: 0,
        };
      }
      acc[songId].play_count++;
      return acc;
    },
    {} as Record<string, SongCount>
  );
  
  // Sort by play count and limit
  return Object.values(songCounts)
    .sort((a, b) => b.play_count - a.play_count)
    .slice(0, limit);
}

/**
 * Get play counts by business type
 */
export async function getPlaysByBusinessType(
  startDate: Date,
  endDate: Date
): Promise<BusinessTypeCount[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("play_logs")
    .select(`
      profiles!inner(business_type)
    `)
    .gte("played_at", startDate.toISOString())
    .lte("played_at", endDate.toISOString());
  
  if (error) {
    console.error("Error getting plays by business type:", error);
    throw error;
  }
  
  // Aggregate by business type
  const typeCounts = (data as PlayLogWithProfiles[] || []).reduce(
    (acc: Record<string, BusinessTypeCount>, log: PlayLogWithProfiles) => {
      const profile = log.profiles as { business_type: string | null } | null;
      const businessType = profile?.business_type || "other";
      if (!acc[businessType]) {
        acc[businessType] = { business_type: businessType, play_count: 0 };
      }
      acc[businessType].play_count++;
      return acc;
    },
    {} as Record<string, BusinessTypeCount>
  );
  
  return Object.values(typeCounts).sort((a, b) => b.play_count - a.play_count);
}

/**
 * Get play counts by genre
 */
export async function getPlaysByGenre(
  startDate: Date,
  endDate: Date
): Promise<GenreCount[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("play_logs")
    .select(`
      songs!inner(genre)
    `)
    .gte("played_at", startDate.toISOString())
    .lte("played_at", endDate.toISOString());
  
  if (error) {
    console.error("Error getting plays by genre:", error);
    throw error;
  }
  
  // Aggregate by genre
  type SongWithGenre = { songs: unknown };
  const genreCounts = (data as SongWithGenre[] || []).reduce(
    (acc: Record<string, GenreCount>, log: SongWithGenre) => {
      const song = log.songs as { genre: string } | null;
      const genre = song?.genre || "other";
      if (!acc[genre]) {
        acc[genre] = { genre, play_count: 0 };
      }
      acc[genre].play_count++;
      return acc;
    },
    {} as Record<string, GenreCount>
  );
  
  return Object.values(genreCounts).sort((a, b) => b.play_count - a.play_count);
}

/**
 * Get genre preferences by business type
 */
export async function getGenreByBusinessType(
  startDate: Date,
  endDate: Date
): Promise<BusinessGenreCount[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("play_logs")
    .select(`
      songs!inner(genre),
      profiles!inner(business_type)
    `)
    .gte("played_at", startDate.toISOString())
    .lte("played_at", endDate.toISOString());
  
  if (error) {
    console.error("Error getting genre by business type:", error);
    throw error;
  }
  
  // Aggregate by business type and genre
  const counts = (data as PlayLogWithSongsAndProfiles[] || []).reduce(
    (acc: Record<string, BusinessGenreCount>, log: PlayLogWithSongsAndProfiles) => {
      const profile = log.profiles as { business_type: string | null } | null;
      const song = log.songs as { genre: string } | null;
      const businessType = profile?.business_type || "other";
      const genre = song?.genre || "other";
      const key = `${businessType}-${genre}`;
      
      if (!acc[key]) {
        acc[key] = { business_type: businessType, genre, play_count: 0 };
      }
      acc[key].play_count++;
      return acc;
    },
    {} as Record<string, BusinessGenreCount>
  );
  
  return Object.values(counts).sort((a, b) => b.play_count - a.play_count);
}

/**
 * Get daily play counts for a date range
 */
export async function getDailyPlayCounts(
  startDate: Date,
  endDate: Date
): Promise<DateCount[]> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from("play_logs")
    .select("played_at")
    .gte("played_at", startDate.toISOString())
    .lte("played_at", endDate.toISOString());
  
  if (error) {
    console.error("Error getting daily play counts:", error);
    throw error;
  }
  
  // Aggregate by date
  const dateCounts = (data as PlayLogWithDate[] || []).reduce(
    (acc: Record<string, DateCount>, log: PlayLogWithDate) => {
      const date = log.played_at.split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, play_count: 0 };
      }
      acc[date].play_count++;
      return acc;
    },
    {} as Record<string, DateCount>
  );
  
  return Object.values(dateCounts).sort((a, b) => a.date.localeCompare(b.date));
}
