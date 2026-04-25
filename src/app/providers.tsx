import { useEffect } from 'react'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/auth.store'
import { authService } from '@/features/auth/api/auth.service'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession)
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session
      setSession(session)
      if (session?.user) {
        try {
          const admin = await authService.checkIsAdmin(session.user.id)
          setIsAdmin(admin)
        } catch {
          setIsAdmin(false)
        }
      }
      setLoading(false)
    }).catch(() => setLoading(false))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Sync: update session and loading immediately so signInWithPassword
      // is not blocked by async operations in this callback.
      setSession(session)
      setLoading(false)

      if (session?.user) {
        authService.checkIsAdmin(session.user.id)
          .then(setIsAdmin)
          .catch(() => setIsAdmin(false))
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, setIsAdmin, setLoading])

  return <>{children}</>
}
