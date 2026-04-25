import { useLocation, Navigate } from 'react-router'
import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '@/shared/stores/auth.store'
import { LoginForm } from './components/LoginForm'

export function Component() {
  const location = useLocation()
  const { session, loading } = useAuthStore(
    useShallow((s) => ({ session: s.session, loading: s.loading })),
  )

  if (!loading && session) {
    return <Navigate to="/admin" replace />
  }

  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-serif tracking-widest text-3xl text-text-primary">YUSVE</h1>
          <p className="text-accent text-xs tracking-widest uppercase font-sans">Acceso Privado</p>
        </div>

        <div className="w-full bg-surface border border-border p-8">
          <LoginForm />
        </div>

        {/* Redirige automáticamente cuando onAuthStateChange actualiza el store */}
        {!loading && session && <Navigate to={from} replace />}
      </div>
    </div>
  )
}
