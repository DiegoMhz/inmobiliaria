import { Link } from 'react-router'
import type { Property } from '@/features/properties/types/property.types'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Skeleton } from '@/shared/ui/Skeleton'
import { formatPrice } from '@/shared/lib/format'
import { getStorageUrl } from '@/shared/lib/storage'

type BadgeVariant = 'active' | 'sold' | 'draft' | 'featured'

const statusVariant: Record<string, BadgeVariant> = {
  active: 'active',
  sold: 'sold',
  draft: 'draft',
  reserved: 'featured',
}

const statusLabel: Record<string, string> = {
  active: 'Activa',
  sold: 'Vendida',
  draft: 'Borrador',
  reserved: 'Reservada',
}

interface PropertiesTableProps {
  properties: Property[]
  loading: boolean
  onDelete: (property: Property) => void
}

export function PropertiesTable({ properties, loading, onDelete }: PropertiesTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border py-4 px-4">
            <Skeleton className="w-[60px] h-[60px] shrink-0" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </div>
    )
  }

  if (!properties.length) {
    return (
      <p className="text-text-secondary font-sans py-10 text-center">
        No hay propiedades registradas.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-sans text-sm">
        <thead>
          <tr className="border-b border-border text-text-secondary text-left">
            <th className="py-3 px-4 font-medium">Foto</th>
            <th className="py-3 px-4 font-medium">Título</th>
            <th className="py-3 px-4 font-medium">Tipo</th>
            <th className="py-3 px-4 font-medium">Precio</th>
            <th className="py-3 px-4 font-medium">Estado</th>
            <th className="py-3 px-4 font-medium text-center">Dest.</th>
            <th className="py-3 px-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id} className="border-b border-border hover:bg-surface-hover transition-colors">
              <td className="py-3 px-4">
                {property.images[0] ? (
                  <img
                    src={getStorageUrl(property.images[0], { width: 120, quality: 70 })}
                    alt={property.title}
                    className="w-[60px] h-[60px] object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] bg-surface border border-border" />
                )}
              </td>
              <td className="py-3 px-4 max-w-[200px]">
                <span className="text-text-primary font-medium truncate block">
                  {property.title}
                </span>
              </td>
              <td className="py-3 px-4 text-text-secondary capitalize">{property.type}</td>
              <td className="py-3 px-4 text-text-primary whitespace-nowrap">
                {formatPrice(property.price, property.currency)}
              </td>
              <td className="py-3 px-4">
                <Badge variant={statusVariant[property.status] ?? 'draft'}>
                  {statusLabel[property.status] ?? property.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-center">
                <input type="checkbox" readOnly checked={property.featured} className="accent-accent" />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    to={`/admin/propiedades/${property.id}/editar`}
                    className="text-accent hover:text-accent-hover text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(property)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
