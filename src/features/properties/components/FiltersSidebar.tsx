import { useState, useEffect } from 'react'
import { Button } from '@/shared/ui/Button'
import { Checkbox } from '@/shared/ui/Checkbox'
import { formatPrice } from '@/shared/lib/format'
import { useDebounce } from '@/shared/hooks/useDebounce'
import type { ParsedFilters } from '../schemas/filters.schema'

const PRICE_MAX = 5_000_000
const PRICE_STEP = 50_000

const PROPERTY_TYPE_OPTIONS = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'penthouse', label: 'Penthouse' },
]

const BEDROOMS_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
]

interface FiltersSidebarProps {
  filters: ParsedFilters
  onChange: (filters: ParsedFilters) => void
}

export function FiltersSidebar({ filters, onChange }: FiltersSidebarProps) {
  const [locationInput, setLocationInput] = useState(filters.location ?? '')
  const debouncedLocation = useDebounce(locationInput, 400)

  useEffect(() => {
    const next = debouncedLocation.trim() || undefined
    if (next !== filters.location) {
      onChange({ ...filters, location: next, page: 1 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLocation])

  // Sync external reset
  useEffect(() => {
    setLocationInput(filters.location ?? '')
  }, [filters.location])

  const priceMax = filters.priceMax ?? PRICE_MAX

  const toggleType = (type: string) => {
    const types = filters.types ?? []
    const next = types.includes(type) ? types.filter((t) => t !== type) : [...types, type]
    onChange({ ...filters, types: next, page: 1 })
  }

  const setBedrooms = (v: number) => {
    const next = filters.bedroomsMin === v ? undefined : v
    onChange({ ...filters, bedroomsMin: next, page: 1 })
  }

  const clearFilters = () => {
    setLocationInput('')
    onChange({ page: 1, priceMin: undefined })
  }

  const hasFilters =
    filters.priceMax != null ||
    (filters.types?.length ?? 0) > 0 ||
    filters.bedroomsMin != null ||
    filters.location

  return (
    <aside className="flex flex-col gap-8">
      {/* Price max */}
      <div>
        <h3 className="text-caption text-accent font-medium tracking-widest uppercase mb-3">
          Precio máximo (USD)
        </h3>
        <p className="text-body text-text-primary font-sans mb-3">
          {priceMax >= PRICE_MAX ? 'Sin límite' : `Hasta ${formatPrice(priceMax)}`}
        </p>
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={priceMax}
          onChange={(e) => {
            const v = Number(e.target.value)
            onChange({ ...filters, priceMax: v >= PRICE_MAX ? undefined : v, page: 1 })
          }}
          className="w-full accent-accent cursor-pointer"
          aria-label="Precio máximo"
        />
        <div className="flex justify-between text-caption text-text-tertiary mt-1">
          <span>$0</span>
          <span>$5M+</span>
        </div>
      </div>

      {/* Property type */}
      <div>
        <h3 className="text-caption text-accent font-medium tracking-widest uppercase mb-4">
          Tipo
        </h3>
        <div className="flex flex-col gap-2.5">
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              id={`type-${opt.value}`}
              label={opt.label}
              checked={(filters.types ?? []).includes(opt.value)}
              onChange={() => toggleType(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <h3 className="text-caption text-accent font-medium tracking-widest uppercase mb-4">
          Habitaciones
        </h3>
        <div className="flex gap-2 flex-wrap">
          {BEDROOMS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setBedrooms(opt.value)}
              className={`px-3 py-1.5 text-sm border transition-colors duration-200 ${
                filters.bedroomsMin === opt.value
                  ? 'border-accent text-accent bg-surface-hover'
                  : 'border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-caption text-accent font-medium tracking-widest uppercase mb-4">
          Ubicación
        </h3>
        <input
          type="text"
          placeholder="Buscar ciudad o zona..."
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="w-full bg-surface border border-border px-4 py-2.5 text-body text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-colors duration-200 font-sans"
        />
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      )}
    </aside>
  )
}
