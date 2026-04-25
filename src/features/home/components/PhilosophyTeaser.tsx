import { useScrollReveal } from '@/shared/hooks/useScrollReveal'

export function PhilosophyTeaser() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} data-reveal className="reveal py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="order-2 md:order-1">
          <div className="aspect-[4/3] bg-surface overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              alt="Arquitectura de lujo"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Text */}
        <div className="order-1 md:order-2">
          <p className="font-sans text-accent tracking-[0.3em] text-caption font-medium uppercase mb-4">
            Nuestra Filosofía
          </p>
          <h2
            className="font-serif text-text-primary mb-6 leading-tight"
            style={{ fontSize: 'var(--text-display)' }}
          >
            El espacio como expresión del carácter
          </h2>
          <div
            className="border-t mb-6"
            style={{ borderColor: 'var(--color-accent)', width: '60px' }}
          />
          <p className="font-sans text-text-secondary text-body leading-relaxed">
            Cada propiedad que representamos es seleccionada bajo criterios estéticos y
            arquitectónicos estrictos. No vendemos metros cuadrados — curamos experiencias de vida
            para quienes entienden el valor de lo excepcional.
          </p>
        </div>
      </div>
    </section>
  )
}
