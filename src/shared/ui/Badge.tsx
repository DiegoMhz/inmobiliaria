import { cn } from '@/shared/lib/cn'

type BadgeVariant = 'active' | 'sold' | 'draft' | 'featured'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  active: 'bg-green-500 text-white',
  sold: 'bg-red-500 text-white',
  draft: 'bg-text-tertiary text-white',
  featured: 'bg-accent text-black',
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-1 text-caption font-medium tracking-wider uppercase',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
