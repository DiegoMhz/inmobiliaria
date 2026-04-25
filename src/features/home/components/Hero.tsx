import { SearchBar } from './SearchBar'
import heroImg from '@/assets/hero.png'

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col">
      {/* Background image */}
      <img
        src={heroImg}
        alt=""
        role="presentation"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark base overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(8,13,26,0.7) 0%, rgba(8,13,26,0.5) 50%, rgba(8,13,26,0.9) 100%)',
        }}
      />

      {/* Lateral decorative overlay (desktop only) */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(8,13,26,0.4) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full">
        <p className="font-sans text-accent tracking-[0.3em] text-sm font-medium uppercase mb-6">
          Propiedades Exclusivas
        </p>
        <h1 className="font-serif text-text-primary mb-6" style={{ fontSize: 'var(--text-hero)' }}>
          Espacios que definen
          <br />
          <em>una nueva elegancia</em>
        </h1>
        <p className="font-sans text-text-secondary text-body max-w-xl leading-relaxed">
          Descubrí propiedades de lujo seleccionadas con criterio editorial. Cada espacio, una obra.
        </p>
      </div>

      {/* SearchBar anchored to bottom */}
      <div className="relative z-10 pb-[60px] px-4 w-full max-w-4xl mx-auto">
        <SearchBar />
      </div>
    </section>
  )
}
