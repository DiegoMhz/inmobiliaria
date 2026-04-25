import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co'
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('[supabase] Missing env vars — running in mock/offline mode')
}

export const supabase = createClient<Database>(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
