import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { Seo } from '@/shared/lib/seo'
import { Button } from '@/shared/ui/Button'
import { PropertyCard } from './components/PropertyCard'
import { FiltersSidebar } from './components/FiltersSidebar'
import { FiltersDrawer } from './components/FiltersDrawer'
import { propertiesService } from './api/properties.service'
import { parseFiltersFromSearch, filtersToSearch } from './schemas/filters.schema'
import type { Property } from './types/property.types'
import type { ParsedFilters } from './schemas/filters.schema'

const PAGE_SIZE = 12

export function Component() {
  const navigate = useNavigate()
  const { search } = useLocation()

  const [filters, setFilters] = useState<ParsedFilters>(() => parseFiltersFromSearch(search))
  const [properties, setProperties] = useState<Property[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const page = filters.page ?? 1
  const totalPages = Math.ceil(count / PAGE_SIZE)

  // Sync filters → URL
  const updateFilters = (next: ParsedFilters) => {
    setFilters(next)
    const qs = filtersToSearch(next)
    navigate(qs ? `/propiedades?${qs}` : '/propiedades', { replace: true })
  }

  // Fetch on filter/page change
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    propertiesService
      .getAll(filters, page)
      .then(({ data, count: total }) => {
        if (!cancelled) {
          setProperties(data)
          setCount(total)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('[PropertiesPage] fetch error', err)
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [filters, page])

  const skeletons = Array.from({ length: PAGE_SIZE })

  return (
    <div className="min-h-screen pt-16 bg-bg">
      <Seo title="Propiedades" description="Explorá nuestro catálogo de propiedades exclusivas. Casas, apartamentos y penthouses de lujo con filtros por precio, tipo y ubicación." />
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-text-primary" style={{ fontSize: 'var(--text-display)' }}>
              Propiedades
            </h1>
            {!loading && (
              <p className="text-body text-text-secondary mt-1">
                {count} {count === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
              </p>
            )}
          </div>

          {/* Mobile filters button */}
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden flex items-center gap-2"
            onClick={() => setDrawerOpen(true)}
          >
            <SlidersHorizontal size={14} />
            Filtros
          </Button>
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <div
            className="hidden lg:block w-[260px] shrink-0"
            style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 80px)', overflowY: 'auto' }}
          >
            <FiltersSidebar filters={filters} onChange={updateFilters} />
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skeletons.map((_, i) => (
                  <PropertyCard key={i} skeleton />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="flex flex-col items-center gap-6 py-24 text-center">
                <p className="font-sans text-text-secondary text-body">
                  No encontramos propiedades con estos criterios.
                </p>
                <Button variant="secondary" size="sm" onClick={() => updateFilters({ page: 1 })}>
                  Ver todas
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <button
                      disabled={page <= 1}
                      onClick={() => updateFilters({ ...filters, page: page - 1 })}
                      className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="font-sans text-body text-text-secondary">
                      {page} / {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => updateFilters({ ...filters, page: page + 1 })}
                      className="p-2 text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                      aria-label="Página siguiente"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={updateFilters}
      />
    </div>
  )
}
