import { useEffect } from 'react'
import { Link, NavLink } from 'react-router'
import { Menu, X } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'
import { cn } from '@/shared/lib/cn'
import { useUIStore } from '@/shared/stores/ui.store'

const NAV_LINKS = [
  { to: '/propiedades', label: 'Propiedades' },
  { to: '/asesor', label: 'El Asesor' },
]

export function Navbar() {
  const { navbarScrolled, isMobileMenuOpen, setNavbarScrolled, toggleMobileMenu, closeMobileMenu } =
    useUIStore(
      useShallow((s) => ({
        navbarScrolled: s.navbarScrolled,
        isMobileMenuOpen: s.isMobileMenuOpen,
        setNavbarScrolled: s.setNavbarScrolled,
        toggleMobileMenu: s.toggleMobileMenu,
        closeMobileMenu: s.closeMobileMenu,
      })),
    )

  useEffect(() => {
    const handler = () => setNavbarScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [setNavbarScrolled])

  // Close mobile menu on ESC
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isMobileMenuOpen, closeMobileMenu])

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          navbarScrolled
            ? 'bg-[rgba(8,13,26,0.90)] backdrop-blur-[20px] border-b border-border'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-serif text-xl text-text-primary tracking-widest hover:text-accent transition-colors duration-200"
          >
            YUSVE
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium tracking-wide transition-colors duration-200',
                    isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href="#footer"
              className="text-sm font-medium tracking-wide text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Contactar
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-text-secondary hover:text-text-primary transition-colors duration-200 p-1"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center gap-10',
          'transition-transform duration-300',
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full',
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              cn(
                'text-2xl font-serif transition-colors duration-200',
                isActive ? 'text-accent' : 'text-text-primary hover:text-accent',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
        <a
          href="#footer"
          onClick={closeMobileMenu}
          className="text-2xl font-serif text-text-primary hover:text-accent transition-colors duration-200"
        >
          Contactar
        </a>
      </div>
    </>
  )
}
