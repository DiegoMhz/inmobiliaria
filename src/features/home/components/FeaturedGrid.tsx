import { use } from 'react'
import { Link } from 'react-router'
import { PropertyCard } from '@/features/properties/components/PropertyCard'
import { Button } from '@/shared/ui/Button'
import { listFeaturedProperties } from '@/features/properties/api/properties.api'

const featuredPromise = listFeaturedProperties()

export function FeaturedGrid() {
  const properties = use(featuredPromise)

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2
        className="font-serif text-text-primary text-center mb-12"
        style={{ fontSize: 'var(--text-display)' }}
      >
        Propiedades Destacadas
      </h2>

      {properties.length === 0 ? (
        <p className="text-center text-text-secondary text-body">
          Próximamente nuevas propiedades exclusivas.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-12">
        <Link to="/propiedades">
          <Button variant="secondary" size="md">
            Ver todas las propiedades
          </Button>
        </Link>
      </div>
    </section>
  )
}
