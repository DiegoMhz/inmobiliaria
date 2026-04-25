import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import type { Property } from '@/features/properties/types/property.types'
import { propertiesService } from '@/features/properties/api/properties.service'
import { PropertiesTable } from './components/PropertiesTable'
import { Button } from '@/shared/ui/Button'

const PAGE_SIZE = 20

export function Component() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')

  const [properties, setProperties] = useState<Property[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    propertiesService
      .getAllAdmin(page)
      .then(({ data, count }) => {
        setProperties(data)
        setCount(count)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page])

  function handleDelete(property: Property) {
    const confirmed = window.confirm(
      `¿Eliminar "${property.title}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return

    const prev = properties
    setProperties((p) => p.filter((x) => x.id !== property.id))

    propertiesService.delete(property.id).catch(() => {
      alert('No se pudo eliminar')
      setProperties(prev)
    })
  }

  const totalPages = Math.ceil(count / PAGE_SIZE)

  function goToPage(p: number) {
    setSearchParams({ page: String(p) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-text-primary">Propiedades</h1>
        <Button variant="primary" onClick={() => navigate('/admin/propiedades/nueva')}>
          Nueva propiedad
        </Button>
      </div>

      <div className="bg-surface border border-border">
        <PropertiesTable properties={properties} loading={loading} onDelete={handleDelete} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 font-sans text-sm">
          <button
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="px-3 py-1.5 border border-border text-text-secondary disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
          >
            Anterior
          </button>
          <span className="text-text-secondary">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="px-3 py-1.5 border border-border text-text-secondary disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
