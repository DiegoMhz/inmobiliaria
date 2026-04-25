import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { Lightbox } from '@/features/properties/components/Lightbox'

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Lightbox />
    </>
  )
}
