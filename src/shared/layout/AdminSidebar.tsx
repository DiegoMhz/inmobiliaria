import { Link, NavLink, useNavigate } from 'react-router'
import { LayoutDashboard, Building2, MessageSquare, User, LogOut } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useAuthStore } from '@/shared/stores/auth.store'
import { supabase } from '@/shared/lib/supabase'

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/propiedades', label: 'Propiedades', icon: Building2, end: false },
  { to: '/admin/consultas', label: 'Consultas', icon: MessageSquare, end: false },
  { to: '/admin/asesor', label: 'El Asesor', icon: User, end: false },
]

export function AdminSidebar() {
  const navigate = useNavigate()
  const reset = useAuthStore((s) => s.reset)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    reset()
    navigate('/admin/login')
  }

  return (
    <aside className="w-[220px] shrink-0 bg-bg-alt min-h-screen flex flex-col border-r border-border">
      <div className="p-6 border-b border-border">
        <Link to="/" className="font-serif text-lg tracking-widest text-text-primary hover:text-accent transition-colors duration-200">
          YUSVE
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {ADMIN_LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'text-accent bg-surface'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface',
              )
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-red-400 transition-colors duration-200 w-full"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
