import { createBrowserRouter } from 'react-router'
import { PublicLayout } from '@/shared/layout/PublicLayout'
import { AdminLayout } from '@/shared/layout/AdminLayout'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { Spinner } from '@/shared/ui/Spinner'

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Spinner size="lg" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        lazy: () => import('@/features/home/HomePage'),
      },
      {
        path: '/propiedades',
        lazy: () => import('@/features/properties/PropertiesPage'),
      },
      {
        path: '/propiedades/:id',
        lazy: () => import('@/features/properties/PropertyDetailPage'),
      },
      {
        path: '/asesor',
        lazy: () => import('@/features/curador/CuradorPage'),
      },
    ],
  },
  {
    path: '/admin/login',
    lazy: () => import('@/features/auth/AdminLoginPage'),
  },
  {
    element: (
      <RequireAuth>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '/admin',
        lazy: () => import('@/features/admin/AdminDashboardPage'),
      },
      {
        path: '/admin/propiedades',
        lazy: () => import('@/features/admin/AdminPropertiesPage'),
      },
      {
        path: '/admin/propiedades/nueva',
        lazy: () => import('@/features/admin/AdminPropertyFormPage'),
      },
      {
        path: '/admin/propiedades/:id/editar',
        lazy: () => import('@/features/admin/AdminPropertyFormPage'),
      },
      {
        path: '/admin/consultas',
        lazy: () => import('@/features/admin/AdminInquiriesPage'),
      },
      {
        path: '/admin/asesor',
        lazy: () => import('@/features/admin/AdminCuradorPage'),
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg">
        <h1 className="font-serif text-display text-text-primary">404</h1>
        <p className="text-body text-text-secondary">Esta página no existe.</p>
        <a href="/" className="text-accent text-sm underline underline-offset-4">
          Volver al inicio
        </a>
      </div>
    ),
  },
])

export { PageLoader }
