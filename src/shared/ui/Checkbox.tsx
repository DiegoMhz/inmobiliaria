import { cn } from '@/shared/lib/cn'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        id={id}
        className={cn(
          'w-4 h-4 border border-border bg-surface accent-accent cursor-pointer',
          className,
        )}
        {...props}
      />
      <span className="text-body text-text-secondary group-hover:text-text-primary transition-colors duration-200">
        {label}
      </span>
    </label>
  )
}
