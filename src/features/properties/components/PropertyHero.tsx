import { MapPin } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import { getStorageUrl } from '@/shared/lib/storage'
import { formatPrice } from '@/shared/lib/format'
import type { Property } from '../types/property.types'

interface PropertyHeroProps {
  property: Property
}

function getBadgeVariant(p: Property) {
  if (p.featured) return 'featured' as const
  if (p.status === 'sold') return 'sold' as const
  return 'active' as const
}

function getBadgeLabel(p: Property) {
  if (p.featured) return 'Destacada'
  if (p.status === 'sold') return 'Vendida'
  return 'Activa'
}

export function PropertyHero({ property }: PropertyHeroProps) {
  const imageUrl =
    property.images[0] != null
      ? getStorageUrl(property.images[0], { width: 1600, quality: 90 })
      : null

  return (
    <section className="relative flex items-end" style={{ height: '60dvh' }}>
      {/* Background */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={property.title}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}

      {/* Lateral overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(8,13,26,0.85) 0%, rgba(8,13,26,0.4) 50%, transparent 100%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(8,13,26,0.95) 0%, transparent 60%)',
        }}
      />

      {/* Content — bottom-left */}
      <div className="relative z-10 px-6 pb-10 max-w-2xl">
        <Badge variant={getBadgeVariant(property)} className="mb-4">
          {getBadgeLabel(property)}
        </Badge>
        <h1
          className="font-serif text-text-primary leading-tight mb-3"
          style={{ fontSize: 'var(--text-display)' }}
        >
          {property.title}
        </h1>
        <p className="font-serif text-accent text-xl mb-3">
          {formatPrice(property.price, property.currency)}
        </p>
        <p className="flex items-center gap-2 text-text-secondary text-body">
          <MapPin size={14} className="shrink-0" />
          {property.location}
        </p>
      </div>
    </section>
  )
}
