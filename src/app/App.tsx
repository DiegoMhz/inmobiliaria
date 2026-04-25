import { Suspense } from 'react'
import { RouterProvider } from 'react-router'
import { router, PageLoader } from './router'
import { AuthProvider } from './providers'

export function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  )
}
