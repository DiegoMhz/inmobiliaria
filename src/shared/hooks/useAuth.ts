import { useEffect } from 'react'
import { useAuthStore } from '@/shared/stores/auth.store'
import { authService } from '@/features/auth/api/auth.service'

export function useAuth() {
  const { setSession, setIsAdmin, setLoading, reset } = useAuthStore()

  useEffect(() => {
    authService.getSession().then(async (session) => {
      setSession(session)
      if (session) {
        const admin = await authService.checkIsAdmin(session.user.id)
        setIsAdmin(admin)
      }
      setLoading(false)
    })

    const { data: listener } = authService.onAuthStateChange(async (_, session) => {
      setSession(session)
      if (session) {
        const admin = await authService.checkIsAdmin(session.user.id)
        setIsAdmin(admin)
      } else {
        reset()
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [setSession, setIsAdmin, setLoading, reset])
}
