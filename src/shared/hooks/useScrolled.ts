import { useEffect } from 'react'
import { useUIStore } from '@/shared/stores/ui.store'

export function useScrolled(threshold = 20) {
  const setNavbarScrolled = useUIStore((s) => s.setNavbarScrolled)

  useEffect(() => {
    const handler = () => setNavbarScrolled(window.scrollY > threshold)

    window.addEventListener('scroll', handler, { passive: true })
    handler()

    return () => window.removeEventListener('scroll', handler)
  }, [threshold, setNavbarScrolled])
}
