import { useEffect, useState, useActionState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { inquiryFormSchema } from '../schemas/inquiry.schema'
import { inquiriesService } from '../api/inquiries.service'

interface InquiryFormProps {
  propertyId: string
}

type FieldErrors = {
  name?: string[]
  email?: string[]
  phone?: string[]
  message?: string[]
}

type ActionState = {
  success: boolean
  error?: string
  fieldErrors?: FieldErrors
}

async function submitInquiry(
  propertyId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: (formData.get('phone') as string) || undefined,
    message: (formData.get('message') as string) || undefined,
  }

  const parsed = inquiryFormSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors as FieldErrors }
  }

  try {
    await inquiriesService.create({
      propertyId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message ?? '',
    })
    return { success: true }
  } catch {
    return { success: false, error: 'No pudimos enviar tu consulta. Intentalo de nuevo.' }
  }
}

function FormCore({
  propertyId,
  onSuccess,
}: {
  propertyId: string
  onSuccess: () => void
}) {
  const [state, formAction, isPending] = useActionState(
    submitInquiry.bind(null, propertyId),
    { success: false },
  )

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success, onSuccess])

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle size={36} className="text-accent" />
        <p className="text-text-primary font-medium">¡Consulta enviada!</p>
        <p className="text-text-secondary text-body">
          Nos contactaremos con vos a la brevedad.
        </p>
      </div>
    )
  }

  const fe = state.fieldErrors

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <Input
        id="inq-name"
        name="name"
        label="Nombre"
        placeholder="Tu nombre"
        autoComplete="name"
        error={fe?.name?.[0]}
      />
      <Input
        id="inq-email"
        name="email"
        type="email"
        label="Email"
        placeholder="tu@email.com"
        autoComplete="email"
        error={fe?.email?.[0]}
      />
      <Input
        id="inq-phone"
        name="phone"
        type="tel"
        label="Teléfono (opcional)"
        placeholder="+54 9 11 0000 0000"
        autoComplete="tel"
        error={fe?.phone?.[0]}
      />
      <Textarea
        id="inq-message"
        name="message"
        label="Mensaje (opcional)"
        placeholder="¿Qué querés saber sobre esta propiedad?"
        rows={4}
        error={fe?.message?.[0]}
      />
      {state.error && (
        <p role="alert" className="text-caption text-red-400">
          {state.error}
        </p>
      )}
      <Button type="submit" loading={isPending} className="w-full">
        Enviar consulta
      </Button>
    </form>
  )
}

export function InquiryForm({ propertyId }: InquiryFormProps) {
  const [epoch, setEpoch] = useState(0)

  const handleSuccess = () => {
    setTimeout(() => setEpoch((e) => e + 1), 5000)
  }

  return <FormCore key={epoch} propertyId={propertyId} onSuccess={handleSuccess} />
}
