"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { createClient, User, Session, SupabaseClient } from "@supabase/supabase-js"
import type { Profile } from "@/types/database"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
})

// プロファイル取得（fetch API使用）
// RLS対応: ユーザーのaccess_tokenを使用して認証
async function fetchProfileFromSupabase(userId: string, accessToken: string): Promise<Profile | null> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(url, {
      headers: {
        "apikey": apiKey || "",
        "Authorization": `Bearer ${accessToken}`, // ユーザーのトークンを使用
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.[0] || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Supabaseクライアントをrefで保持（再作成を防ぐ）
  const supabaseRef = useRef<SupabaseClient | null>(null)
  
  // Supabaseクライアントを取得
  const getSupabase = () => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        }
      )
    }
    return supabaseRef.current
  }

  const fetchProfile = async (userId: string, accessToken: string) => {
    const data = await fetchProfileFromSupabase(userId, accessToken)
    if (data) {
      setProfile(data)
    }
  }

  const refreshProfile = async () => {
    if (user && session?.access_token) {
      await fetchProfile(user.id, session.access_token)
    }
  }

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  useEffect(() => {
    const supabase = getSupabase()
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user && session.access_token) {
          await fetchProfile(session.user.id, session.access_token)
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user && session.access_token) {
        await fetchProfile(session.user.id, session.access_token)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAdmin: profile?.is_admin ?? false,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
