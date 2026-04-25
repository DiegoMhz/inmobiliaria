import { useState } from 'react'
import { Outlet } from 'react-router'
import { Menu, X } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { cn } from '@/shared/lib/cn'

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full lg:hidden transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <AdminSidebar />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 px-4 h-14 border-b border-border bg-bg-alt">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
            className="text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            <Menu size={20} />
          </button>
          <span className="font-serif text-lg tracking-widest text-text-primary">YUSVE</span>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              className="ml-auto text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <X size={20} />
            </button>
          )}
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
