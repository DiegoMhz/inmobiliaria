import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { Seo } from '@/shared/lib/seo'
import { getStorageUrl } from '@/shared/lib/storage'
import { propertiesService } from './api/properties.service'
import { PropertyHero } from './components/PropertyHero'
import { StatsBar } from './components/StatsBar'
import { Gallery } from './components/Gallery'
import { InquiryForm } from './components/InquiryForm'
import { Lightbox } from './components/Lightbox'
import type { Property } from './types/property.types'

function NotFound() {
  return (
    <>
      <Seo title="Propiedad no encontrada" />
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg">
        <h1 className="font-serif text-text-primary" style={{ fontSize: 'var(--text-display)' }}>
          Propiedad no encontrada
        </h1>
        <p className="text-text-secondary text-body">
          Esta propiedad no existe o fue removida.
        </p>
        <Link
          to="/propiedades"
          className="text-accent text-sm underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          Ver todas las propiedades
        </Link>
      </div>
    </>
  )
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-bg animate-pulse">
      <div className="bg-surface-hover" style={{ height: '60dvh' }} />
      <div className="border-y border-border bg-surface h-20" />
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 aspect-video bg-surface-hover" />
        <div className="w-full lg:w-[380px] bg-surface-hover h-96" />
      </div>
    </div>
  )
}

function PropertyDetail({ id }: { id: string }) {
  const [property, setProperty] = useState<Property | null | 'loading'>('loading')

  useEffect(() => {
    let cancelled = false

    propertiesService
      .getById(id)
      .then((p) => {
        if (!cancelled) setProperty(p)
      })
      .catch((err) => {
        console.error('[PropertyDetailPage] fetch error', err)
        if (!cancelled) setProperty(null)
      })

    return () => { cancelled = true }
  }, [id])

  if (property === 'loading') return <DetailSkeleton />
  if (!property) return <NotFound />

  const ogImage =
    property.images[0] != null
      ? getStorageUrl(property.images[0], { width: 1200, quality: 85 })
      : undefined

  return (
    <>
      <Seo
        title={property.title}
        description={property.description || undefined}
        image={ogImage}
      />

      <PropertyHero property={property} />
      <StatsBar property={property} />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Gallery + description */}
          <div className="flex-1 min-w-0">
            {property.images.length > 0 && <Gallery images={property.images} />}

            {property.description && (
              <div className="mt-10">
                <h2
                  className="font-serif text-text-primary mb-4"
                  style={{ fontSize: 'var(--text-title)' }}
                >
                  Descripción
                </h2>
                <p className="text-text-secondary text-body leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Inquiry sidebar */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div
              className="bg-surface border border-border p-8 lg:sticky"
              style={{ top: '100px' }}
            >
              <h2
                className="font-serif text-text-primary mb-6"
                style={{ fontSize: 'var(--text-title)' }}
              >
                Consultar propiedad
              </h2>
              <InquiryForm propertyId={property.id} />
            </div>
          </aside>
        </div>
      </section>

      <Lightbox />
    </>
  )
}

export function Component() {
  const { id } = useParams<{ id: string }>()

  if (!id) return <NotFound />

  return <PropertyDetail id={id} />
}
