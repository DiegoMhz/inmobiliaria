import { useState, useEffect } from 'react'
import { Seo } from '@/shared/lib/seo'
import { getStorageUrl } from '@/shared/lib/storage'
import { useScrollReveal } from '@/shared/hooks/useScrollReveal'
import { curadorService } from '@/features/admin/api/curador.service'

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'
const DEFAULT_BIO = 'Más de quince años seleccionando propiedades que trascienden el mercado convencional. Cada elección responde a criterios estéticos, arquitectónicos y culturales que definen un estilo de vida único e irrepetible.'

const PHILOSOPHY = [
  {
    number: '01',
    title: 'Criterio editorial',
    description:
      'Cada propiedad pasa por un proceso de selección riguroso donde arquitectura, historia y contexto urbano determinan su valor real.',
  },
  {
    number: '02',
    title: 'Exclusividad real',
    description:
      'No trabajamos con volumen. Representamos un número limitado de propiedades por año para garantizar atención y criterio en cada elección.',
  },
  {
    number: '03',
    title: 'Visión a largo plazo',
    description:
      'El lujo verdadero no es efímero. Seleccionamos espacios que preservan y aumentan su valor cultural y económico a través del tiempo.',
  },
]

export function Component() {
  const philosophyRef = useScrollReveal<HTMLElement>()
  const [photo, setPhoto] = useState(DEFAULT_PHOTO)
  const [bio, setBio] = useState(DEFAULT_BIO)

  useEffect(() => {
    curadorService.getSettings().then((s) => {
      if (s.photo_url) setPhoto(getStorageUrl(s.photo_url, { width: 600, quality: 85 }))
      if (s.bio) setBio(s.bio)
    }).catch(() => {})
  }, [])

  return (
    <>
      <Seo
        title="El Asesor"
        description="Conocé la filosofía y criterios detrás de la selección de propiedades de lujo en Yusve."
      />

      <div className="min-h-screen bg-bg">
        {/* Hero */}
        <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
          {/* MMXXIV decoration */}
          <span
            className="absolute top-8 right-0 font-serif text-text-tertiary pointer-events-none select-none leading-none hidden md:block"
            style={{ fontSize: 'clamp(4rem, 10vw, 10rem)' }}
            aria-hidden="true"
          >
            MMXXIV
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            {/* Foto en escala de grises */}
            <div className="order-2 md:order-1">
              <div className="aspect-[3/4] overflow-hidden bg-surface">
                <img
                  src={photo}
                  alt="El Asesor"
                  loading="lazy"
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
            </div>

            {/* Texto */}
            <div className="order-1 md:order-2">
              <p className="font-sans text-accent tracking-[0.3em] text-caption font-medium uppercase mb-4">
                Nuestro Asesor
              </p>
              <h1
                className="font-serif text-text-primary mb-6 leading-tight"
                style={{ fontSize: 'var(--text-display)' }}
              >
                El arte de elegir
                <br />
                <em>lo extraordinario</em>
              </h1>
              <div
                className="border-t mb-6"
                style={{ borderColor: 'var(--color-accent)', width: '60px' }}
              />
              <p className="font-sans text-text-secondary text-body leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </div>
          </div>
        </section>

        {/* Filosofía */}
        <section
          ref={philosophyRef}
          data-reveal
          className="reveal border-t border-border py-24 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <p className="font-sans text-accent tracking-[0.3em] text-caption font-medium uppercase mb-12 text-center">
              Nuestra Filosofía
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3">
              {PHILOSOPHY.map((item, i) => (
                <div key={item.title} className="relative px-8 py-10 text-center">
                  {i < PHILOSOPHY.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/4 h-1/2 border-r border-border" />
                  )}
                  <span
                    className="font-serif text-accent mb-3 block"
                    style={{ fontSize: 'var(--text-display)' }}
                  >
                    {item.number}
                  </span>
                  <h3
                    className="font-serif text-text-primary mb-4"
                    style={{ fontSize: 'var(--text-title)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="font-sans text-text-secondary text-body leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
