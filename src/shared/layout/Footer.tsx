import { Link } from 'react-router'
import { Globe } from 'lucide-react'

const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/yusve',
  facebook: 'https://facebook.com/yusve',
  linkedin: 'https://linkedin.com/company/yusve',
}

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/propiedades', label: 'Propiedades' },
  { to: '/asesor', label: 'El Asesor' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="bg-bg-alt">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Col 1: Brand */}
          <div>
            <span className="font-serif text-2xl text-text-primary tracking-widest">YUSVE</span>
            <p className="mt-3 text-body text-text-secondary leading-relaxed">
              Propiedades de lujo curadas con visión editorial.
            </p>
          </div>

          {/* Col 2: Nav */}
          <div>
            <h3 className="text-caption text-accent font-medium tracking-widest uppercase mb-4">
              Navegación
            </h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-body text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Social */}
          <div>
            <h3 className="text-caption text-accent font-medium tracking-widest uppercase mb-4">
              Redes Sociales
            </h3>
            <div className="flex gap-4">
              {Object.entries(SOCIAL_LINKS).map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name.charAt(0).toUpperCase() + name.slice(1)}
                  className="text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  <Globe size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-border mb-6" />
        <p className="text-caption text-text-tertiary text-center">
          © {year} YUSVE. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
