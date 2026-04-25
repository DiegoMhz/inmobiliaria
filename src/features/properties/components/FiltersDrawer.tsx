import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { FiltersSidebar } from './FiltersSidebar'
import type { ParsedFilters } from '../schemas/filters.schema'

interface FiltersDrawerProps {
  open: boolean
  onClose: () => void
  filters: ParsedFilters
  onChange: (filters: ParsedFilters) => void
}

export function FiltersDrawer({ open, onClose, filters, onChange }: FiltersDrawerProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[300px] bg-bg-alt border-r border-border',
          'overflow-y-auto p-6 lg:hidden transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Filtros"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-text-primary text-lg">Filtros</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar filtros"
            className="text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <FiltersSidebar
          filters={filters}
          onChange={(f) => {
            onChange(f)
            onClose()
          }}
        />
      </div>
    </>
  )
}
