import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Debug: Check if environment variables are loaded
  if (typeof window !== 'undefined') {
    console.log('[Supabase Client] URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.log('[Supabase Client] Anon Key:', supabaseAnonKey ? 'SET' : 'MISSING');
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase Client] Missing environment variables!');
    throw new Error('Supabase environment variables are not configured');
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton pattern for client-side usage
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
}
