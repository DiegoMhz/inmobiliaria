import type { LucideIcon } from 'lucide-react'
import { Skeleton } from '@/shared/ui/Skeleton'

interface MetricCardProps {
  icon: LucideIcon
  label: string
  value: number | null
}

export function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <div className="bg-surface border border-border p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 text-text-secondary">
        <Icon size={20} />
        <span className="text-sm font-sans">{label}</span>
      </div>

      {value === null ? (
        <Skeleton className="h-10 w-24" />
      ) : (
        <p className="font-serif text-4xl text-accent">{value.toLocaleString('es-AR')}</p>
      )}
    </div>
  )
}
