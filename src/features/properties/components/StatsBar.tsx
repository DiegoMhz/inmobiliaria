import { BedDouble, Bath, Maximize2, MapPin } from 'lucide-react'
import { formatSqm } from '@/shared/lib/format'
import type { Property } from '../types/property.types'

interface StatsBarProps {
  property: Property
}

export function StatsBar({ property }: StatsBarProps) {
  const stats = [
    { icon: BedDouble, label: 'Habitaciones', value: String(property.bedrooms) },
    { icon: Bath, label: 'Baños', value: String(property.bathrooms) },
    { icon: Maximize2, label: 'Superficie', value: formatSqm(property.sqm) },
    { icon: MapPin, label: 'Ubicación', value: property.location },
  ]

  return (
    <div className="bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`flex items-center gap-4 px-6 py-6 ${
                i < stats.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''
              }`}
            >
              <Icon size={20} className="text-accent shrink-0" />
              <div>
                <p className="text-caption text-text-tertiary uppercase tracking-wide">{label}</p>
                <p className="text-body text-text-primary font-medium truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
