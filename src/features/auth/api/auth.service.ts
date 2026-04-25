import { supabase } from '@/shared/lib/supabase'

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.session
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  async checkIsAdmin(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
    return data != null
  },

  onAuthStateChange: supabase.auth.onAuthStateChange.bind(supabase.auth),
}
