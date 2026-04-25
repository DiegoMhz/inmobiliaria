import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/format'

interface RangeSliderProps {
  min: number
  max: number
  valueMin: number
  valueMax: number
  step?: number
  onChangeMin: (v: number) => void
  onChangeMax: (v: number) => void
  className?: string
}

export function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  step = 10000,
  onChangeMin,
  onChangeMax,
  className,
}: RangeSliderProps) {
  const pctMin = ((valueMin - min) / (max - min)) * 100
  const pctMax = ((valueMax - min) / (max - min)) * 100

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex justify-between text-caption text-text-secondary">
        <span>{formatPrice(valueMin)}</span>
        <span>{formatPrice(valueMax)}</span>
      </div>
      <div className="relative h-1 bg-border">
        <div
          className="absolute h-1 bg-accent"
          style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (v <= valueMax) onChangeMin(v)
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ '--progress': `${pctMin}%` } as React.CSSProperties}
          aria-label="Precio mínimo"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (v >= valueMin) onChangeMax(v)
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ '--progress': `${pctMax}%` } as React.CSSProperties}
          aria-label="Precio máximo"
        />
      </div>
    </div>
  )
}
