import { createBrowserClient } from "@supabase/ssr";

// Singleton pattern for client-side usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseClient: any = null;

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function getSupabaseClient() {
  // ブラウザ環境でのみシングルトンを使用
  if (typeof window === "undefined") {
    return createClient();
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
}

// クライアントをリセット（デバッグ用）
export function resetSupabaseClient() {
  supabaseClient = null;
}
