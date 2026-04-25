import { cn } from '@/shared/lib/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  id: string
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-caption text-text-secondary font-medium tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={cn(
          'bg-surface border px-4 py-3 text-text-primary placeholder:text-text-tertiary',
          'outline-none transition-colors duration-200 font-sans text-body w-full',
          error ? 'border-red-500' : 'border-border focus:border-accent',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-caption text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
