import { useScrollReveal } from '@/shared/hooks/useScrollReveal'

const STATS = [
  { value: '200+', label: 'Propiedades vendidas' },
  { value: '15', label: 'Años de experiencia' },
  { value: '98%', label: 'Clientes satisfechos' },
  { value: '$2B+', label: 'En transacciones' },
]

export function StatsSection() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} data-reveal className="reveal py-20 px-6 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center py-8 px-4 relative"
            >
              {/* Vertical separator (desktop only) */}
              {i < STATS.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/4 h-1/2 border-r border-border" />
              )}
              <span
                className="font-serif text-accent mb-2 leading-none"
                style={{ fontSize: 'var(--text-display)' }}
              >
                {stat.value}
              </span>
              <span className="font-sans text-text-secondary text-caption tracking-wide uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
