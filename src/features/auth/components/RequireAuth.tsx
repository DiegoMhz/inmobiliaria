import { Navigate, useLocation } from 'react-router'
import { useShallow } from 'zustand/react/shallow'
import { Spinner } from '@/shared/ui/Spinner'
import { useAuthStore } from '@/shared/stores/auth.store'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { session, loading } = useAuthStore(
    useShallow((s) => ({ session: s.session, loading: s.loading })),
  )
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
