import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'

interface AuthState {
  session: Session | null
  isAdmin: boolean
  loading: boolean
  setSession: (s: Session | null) => void
  setIsAdmin: (v: boolean) => void
  setLoading: (v: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  session: null,
  isAdmin: false,
  loading: true,
  setSession: (session) => set({ session }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ session: null, isAdmin: false, loading: false }),
}))
