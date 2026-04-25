import { useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { useUIStore } from '@/shared/stores/ui.store'

export function Lightbox() {
  const { lightbox, closeLightbox, setLightboxIndex } = useUIStore(
    useShallow((s) => ({
      lightbox: s.lightbox,
      closeLightbox: s.closeLightbox,
      setLightboxIndex: s.setLightboxIndex,
    })),
  )

  const { open, images, index } = lightbox
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<Element | null>(null)

  // Remember what triggered the open for focus restore
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement
    } else if (openerRef.current instanceof HTMLElement) {
      openerRef.current.focus()
      openerRef.current = null
    }
  }, [open])

  const prev = () => setLightboxIndex((index - 1 + images.length) % images.length)
  const next = () => setLightboxIndex((index + 1) % images.length)

  // Keyboard navigation — captures current prev/next via closure on each render
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') setLightboxIndex((index - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setLightboxIndex((index + 1) % images.length)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, closeLightbox, setLightboxIndex, index, images.length])

  // Focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return
    const panel = panelRef.current
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [open])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open || images.length === 0) return null

  const currentImage = images[index]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)' }}
      onClick={closeLightbox}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de imágenes"
    >
      <div
        ref={panelRef}
        className="relative flex items-center justify-center w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={closeLightbox}
          aria-label="Cerrar galería"
          className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors duration-200"
        >
          <X size={24} />
        </button>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-4 z-10 p-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {/* Image */}
        <img
          key={currentImage}
          src={currentImage}
          alt={`Imagen ${index + 1} de ${images.length}`}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none"
        />

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={next}
            aria-label="Imagen siguiente"
            className="absolute right-4 z-10 p-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ChevronRight size={32} />
          </button>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-caption">
            {index + 1} / {images.length}
          </p>
        )}
      </div>
    </div>
  )
}
