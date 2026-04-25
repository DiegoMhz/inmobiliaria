import { useState, useEffect } from 'react'
import { inquiriesService } from '@/features/properties/api/inquiries.service'
import { propertiesService } from '@/features/properties/api/properties.service'
import type { Inquiry } from '@/features/properties/types/inquiry.types'
import type { Property } from '@/features/properties/types/property.types'
import { Skeleton } from '@/shared/ui/Skeleton'

const PAGE_SIZE = 20

export function Component() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    propertiesService.getAllAdmin().then(({ data }) => setProperties(data)).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    setPage(1)
    inquiriesService
      .getAll(selectedPropertyId || undefined)
      .then(setInquiries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedPropertyId])

  const totalPages = Math.ceil(inquiries.length / PAGE_SIZE)
  const paginatedInquiries = inquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-serif text-3xl text-text-primary">Consultas</h1>

        <div className="flex flex-col gap-1.5 sm:w-64">
          <label
            htmlFor="property-filter"
            className="text-caption text-text-secondary font-medium tracking-wide uppercase"
          >
            Filtrar por propiedad
          </label>
          <select
            id="property-filter"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="bg-surface border border-border px-4 py-3 text-text-primary outline-none focus:border-accent w-full font-sans text-body"
          >
            <option value="">Todas las propiedades</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-surface border border-border">
        {loading ? (
          <div className="flex flex-col gap-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-border py-4 px-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <p className="text-text-secondary font-sans py-10 text-center">
            No hay consultas registradas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary text-left">
                  <th className="py-3 px-4 font-medium">Nombre</th>
                  <th className="py-3 px-4 font-medium">Email</th>
                  <th className="py-3 px-4 font-medium">Teléfono</th>
                  <th className="py-3 px-4 font-medium">Mensaje</th>
                  <th className="py-3 px-4 font-medium whitespace-nowrap">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="border-b border-border hover:bg-surface-hover transition-colors"
                  >
                    <td className="py-3 px-4 text-text-primary font-medium whitespace-nowrap">
                      {inquiry.name}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{inquiry.email}</td>
                    <td className="py-3 px-4 text-text-secondary">
                      {inquiry.phone ?? '—'}
                    </td>
                    <td className="py-3 px-4 text-text-secondary max-w-xs">
                      <span className="block truncate" title={inquiry.message}>
                        {inquiry.message.length > 80
                          ? `${inquiry.message.slice(0, 80)}…`
                          : inquiry.message}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary whitespace-nowrap">
                      {new Date(inquiry.createdAt).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 font-sans text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 border border-border text-text-secondary disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
          >
            Anterior
          </button>
          <span className="text-text-secondary">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 border border-border text-text-secondary disabled:opacity-40 hover:border-accent hover:text-accent transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
