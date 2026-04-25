import { useActionState, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { authService } from '@/features/auth/api/auth.service'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

interface LoginFormProps {
  onSuccess?: () => void
}

interface ActionState {
  error: string | null
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  const [state, submitAction, isPending] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      const raw = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      }

      const parsed = loginSchema.safeParse(raw)
      if (!parsed.success) {
        return { error: 'Credenciales incorrectas.' }
      }

      try {
        await authService.signIn(parsed.data.email, parsed.data.password)
        // onAuthStateChange actualiza el store → AdminLoginPage redirige sola
        return { error: null }
      } catch {
        return { error: 'Credenciales incorrectas.' }
      }
    },
    { error: null },
  )

  return (
    <form action={submitAction} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-caption text-text-secondary font-medium tracking-wide uppercase font-sans"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={cn(
            'bg-surface border border-border px-4 py-3 text-text-primary placeholder:text-text-tertiary',
            'outline-none transition-colors duration-200 font-sans text-body w-full',
            'focus:border-accent',
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-caption text-text-secondary font-medium tracking-wide uppercase font-sans"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className={cn(
              'bg-surface border border-border px-4 py-3 pr-12 text-text-primary placeholder:text-text-tertiary',
              'outline-none transition-colors duration-200 font-sans text-body w-full',
              'focus:border-accent',
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary hover:text-text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-400 font-sans">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={isPending} className="w-full mt-1">
        Ingresar
      </Button>
    </form>
  )
}
