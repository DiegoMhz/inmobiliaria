import { useState } from 'react'
import type { z } from 'zod'
import { propertyFormSchema } from '@/features/properties/schemas/property.schema'
import { PROPERTY_TYPE, PROPERTY_STATUS } from '@/features/properties/types/property.types'
import type { Property, PropertyStatus } from '@/features/properties/types/property.types'
import { Input } from '@/shared/ui/Input'
import { Textarea } from '@/shared/ui/Textarea'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Button } from '@/shared/ui/Button'
import { ImageUploader } from './ImageUploader'
import { cn } from '@/shared/lib/cn'

type FormErrors = Partial<Record<keyof z.infer<typeof propertyFormSchema>, string>>

interface PropertyFormProps {
  initial?: Partial<Property>
  mode: 'create' | 'edit'
  isPending: boolean
  submitError: string | null
  onSubmit: (data: z.infer<typeof propertyFormSchema>, existingImages: string[], newFiles: File[]) => void
}

const selectClass = cn(
  'bg-surface border border-border px-4 py-3 text-text-primary',
  'outline-none focus:border-accent w-full font-sans text-body',
)

const labelClass = 'text-caption text-text-secondary font-medium tracking-wide uppercase'

export function PropertyForm({ initial, mode, isPending, submitError, onSubmit }: PropertyFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(String(initial?.price ?? ''))
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'ARS'>(initial?.currency ?? 'USD')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [type, setType] = useState(initial?.type ?? '')
  const [bedrooms, setBedrooms] = useState(String(initial?.bedrooms ?? '0'))
  const [bathrooms, setBathrooms] = useState(String(initial?.bathrooms ?? '0'))
  const [sqm, setSqm] = useState(String(initial?.sqm ?? ''))
  const [status, setStatus] = useState(initial?.status ?? 'draft')
  const [featured, setFeatured] = useState(initial?.featured ?? false)
  const [existingImages, setExistingImages] = useState<string[]>(initial?.images ?? [])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<FormErrors>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const raw = {
      title,
      description,
      price: Number(price),
      currency,
      location,
      type,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqm: Number(sqm),
      status,
      featured,
    }

    const result = propertyFormSchema.safeParse(raw)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormErrors
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onSubmit(result.data, existingImages, newFiles)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        id="title"
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <Textarea
        id="description"
        label="Descripción"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          id="price"
          label="Precio"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={errors.price}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="currency" className={labelClass}>Moneda</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'ARS')}
            className={selectClass}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ARS">ARS</option>
          </select>
        </div>
      </div>

      <Input
        id="location"
        label="Ubicación"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={errors.location}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="type" className={labelClass}>Tipo</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={cn(selectClass, errors.type ? 'border-red-500' : 'border-border')}
        >
          <option value="">Seleccioná un tipo</option>
          <option value={PROPERTY_TYPE.HOUSE}>Casa</option>
          <option value={PROPERTY_TYPE.APARTMENT}>Apartamento</option>
          <option value={PROPERTY_TYPE.PENTHOUSE}>Penthouse</option>
          <option value={PROPERTY_TYPE.VILLA}>Villa</option>
          <option value={PROPERTY_TYPE.ESTATE}>Estate</option>
        </select>
        {errors.type && <p role="alert" className="text-caption text-red-400">{errors.type}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Input
          id="bedrooms"
          label="Habitaciones"
          type="number"
          min={0}
          max={20}
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          error={errors.bedrooms}
        />
        <Input
          id="bathrooms"
          label="Baños"
          type="number"
          min={0}
          max={20}
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          error={errors.bathrooms}
        />
        <Input
          id="sqm"
          label="Superficie m²"
          type="number"
          min={0}
          value={sqm}
          onChange={(e) => setSqm(e.target.value)}
          error={errors.sqm}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className={labelClass}>Estado</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as PropertyStatus)}
          className={selectClass}
        >
          <option value={PROPERTY_STATUS.ACTIVE}>Activa</option>
          <option value={PROPERTY_STATUS.DRAFT}>Borrador</option>
          <option value={PROPERTY_STATUS.SOLD}>Vendida</option>
          <option value={PROPERTY_STATUS.RESERVED}>Reservada</option>
        </select>
      </div>

      <Checkbox
        id="featured"
        label="Destacada"
        checked={featured}
        onChange={(e) => setFeatured(e.target.checked)}
      />

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Imágenes</span>
        <ImageUploader
          value={existingImages}
          onChange={setExistingImages}
          newFiles={newFiles}
          onNewFiles={setNewFiles}
        />
      </div>

      {submitError && (
        <p role="alert" className="text-caption text-red-400">
          {submitError}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" size="lg" loading={isPending}>
          {mode === 'create' ? 'Crear propiedad' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}
