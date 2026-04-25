import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface LightboxState {
  open: boolean
  images: string[]
  index: number
}

interface UIState {
  filtersDrawerOpen: boolean
  toggleFiltersDrawer: () => void
  closeFiltersDrawer: () => void

  lightbox: LightboxState
  openLightbox: (images: string[], index: number) => void
  closeLightbox: () => void
  setLightboxIndex: (i: number) => void

  navbarScrolled: boolean
  setNavbarScrolled: (v: boolean) => void

  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

function createStore(set: (fn: (s: UIState) => Partial<UIState>) => void): UIState {
  return {
    filtersDrawerOpen: false,
    toggleFiltersDrawer: () => set((s) => ({ filtersDrawerOpen: !s.filtersDrawerOpen })),
    closeFiltersDrawer: () => set(() => ({ filtersDrawerOpen: false })),

    lightbox: { open: false, images: [], index: 0 },
    openLightbox: (images, index) => set(() => ({ lightbox: { open: true, images, index } })),
    closeLightbox: () => set((s) => ({ lightbox: { ...s.lightbox, open: false } })),
    setLightboxIndex: (i) => set((s) => ({ lightbox: { ...s.lightbox, index: i } })),

    navbarScrolled: false,
    setNavbarScrolled: (v) => set(() => ({ navbarScrolled: v })),

    isMobileMenuOpen: false,
    toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
    closeMobileMenu: () => set(() => ({ isMobileMenuOpen: false })),
  }
}

export const useUIStore = import.meta.env.DEV
  ? create<UIState>()(devtools(createStore, { name: 'ui-store' }))
  : create<UIState>()(createStore)
