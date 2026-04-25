import { Link } from 'react-router'
import { MapPin, BedDouble, Bath, SquareIcon } from 'lucide-react'
import { Badge } from '@/shared/ui/Badge'
import { getStorageUrl } from '@/shared/lib/storage'
import { formatPrice, formatSqm } from '@/shared/lib/format'
import type { Property } from '../types/property.types'

interface PropertyCardProps {
  property: Property
  skeleton?: false
}

interface PropertyCardSkeletonProps {
  skeleton: true
}

type Props = PropertyCardProps | PropertyCardSkeletonProps

function getBadgeVariant(property: Property) {
  if (property.featured) return 'featured' as const
  if (property.status === 'sold') return 'sold' as const
  if (property.status === 'active') return 'active' as const
  return 'draft' as const
}

function getBadgeLabel(property: Property) {
  if (property.featured) return 'Destacada'
  if (property.status === 'sold') return 'Vendida'
  if (property.status === 'active') return 'Activa'
  return 'Borrador'
}

export function PropertyCard(props: Props) {
  if (props.skeleton) {
    return (
      <div className="bg-surface border border-border flex flex-col">
        <div className="aspect-[4/3] shimmer" />
        <div className="p-4 flex flex-col gap-3">
          <div className="h-4 shimmer w-3/4" />
          <div className="h-5 shimmer w-1/2" />
          <div className="h-3 shimmer w-full" />
        </div>
      </div>
    )
  }

  const { property } = props
  const imageUrl =
    property.images[0] != null
      ? getStorageUrl(property.images[0], { width: 600, quality: 80 })
      : null

  return (
    <Link
      to={`/propiedades/${property.id}`}
      className="block bg-surface border border-border hover:border-border-hover transition-all duration-200 group"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-surface-hover flex items-center justify-center">
            <SquareIcon size={32} className="text-text-tertiary" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={getBadgeVariant(property)}>{getBadgeLabel(property)}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3
          className="font-serif text-text-primary leading-snug line-clamp-2"
          style={{ fontSize: 'var(--text-title)' }}
        >
          {property.title}
        </h3>

        <p className="font-serif text-accent font-medium text-lg">
          {formatPrice(property.price, property.currency)}
        </p>

        <div className="flex items-center gap-4 text-caption text-text-secondary">
          <span className="flex items-center gap-1.5">
            <BedDouble size={14} />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={14} />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <SquareIcon size={14} />
            {formatSqm(property.sqm)}
          </span>
        </div>

        <p className="flex items-center gap-1.5 text-caption text-text-tertiary">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{property.location}</span>
        </p>
      </div>
    </Link>
  )
}
