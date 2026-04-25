import { cn } from '@/shared/lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border',
        'transition-all duration-200 hover:bg-surface-hover hover:border-border-hover',
        className,
      )}
    >
      {children}
    </div>
  )
}
