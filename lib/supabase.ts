import { createClient } from "@supabase/supabase-js"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export const createServerClient = () =>
  createPagesBrowserClient<Database>({
    supabaseUrl: supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })

