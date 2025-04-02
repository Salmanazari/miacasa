import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire client-side application
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return createSupabaseClient("https://placeholder-url.supabase.co", "placeholder-key")
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

