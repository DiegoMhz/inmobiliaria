import { Suspense } from 'react'
import { Seo } from '@/shared/lib/seo'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Hero } from './components/Hero'
import { PhilosophyTeaser } from './components/PhilosophyTeaser'
import { StatsSection } from './components/StatsSection'
import { FeaturedGrid } from './components/FeaturedGrid'

function FeaturedGridSkeleton() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="h-10 shimmer w-72 mx-auto mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full" />
        ))}
      </div>
    </section>
  )
}

export function Component() {
  return (
    <>
      <Seo
        title="Propiedades de Lujo"
        description="Descubrí propiedades de lujo seleccionadas con criterio editorial. Casas, apartamentos y penthouses exclusivos en las mejores ubicaciones."
      />
      <Hero />
      <PhilosophyTeaser />
      <StatsSection />
      <Suspense fallback={<FeaturedGridSkeleton />}>
        <FeaturedGrid />
      </Suspense>
    </>
  )
}
