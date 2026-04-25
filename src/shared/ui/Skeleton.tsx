import { cn } from '@/shared/lib/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('shimmer', className)} aria-hidden="true" />
}
