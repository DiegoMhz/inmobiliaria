import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { z } from 'zod'
import type { propertyFormSchema } from '@/features/properties/schemas/property.schema'
import { propertiesService } from '@/features/properties/api/properties.service'
import { storageService } from './api/storage.service'
import type { Property } from '@/features/properties/types/property.types'
import { Spinner } from '@/shared/ui/Spinner'
import { PropertyForm } from './components/PropertyForm'

export function Component() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const mode = id ? 'edit' : 'create'

  const [property, setProperty] = useState<Property | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(mode === 'edit')
  const [isPending, setIsPending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'edit' || !id) return

    propertiesService
      .getById(id)
      .then((p) => {
        if (!p) setLoadError('Propiedad no encontrada.')
        else setProperty(p)
      })
      .catch(() => setLoadError('No se pudo cargar la propiedad.'))
      .finally(() => setLoading(false))
  }, [id, mode])

  async function handleSubmit(
    data: z.infer<typeof propertyFormSchema>,
    existingImages: string[],
    newFiles: File[],
  ) {
    setIsPending(true)
    setSubmitError(null)

    try {
      if (mode === 'create') {
        const created = await propertiesService.create({ ...data, images: [] })
        let images: string[] = []
        if (newFiles.length) {
          images = await storageService.uploadImages(created.id, newFiles)
        }
        if (images.length) {
          await propertiesService.update(created.id, { images })
        }
      } else {
        let newPaths: string[] = []
        if (newFiles.length) {
          newPaths = await storageService.uploadImages(id!, newFiles)
        }
        await propertiesService.update(id!, {
          ...data,
          images: [...existingImages, ...newPaths],
        })
      }

      navigate('/admin/propiedades')
    } catch {
      setSubmitError('Ocurrió un error al guardar la propiedad. Intentá de nuevo.')
    } finally {
      setIsPending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl text-text-primary">Error</h1>
        <p className="text-text-secondary font-sans">{loadError}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <h1 className="font-serif text-3xl text-text-primary">
        {mode === 'create' ? 'Nueva propiedad' : 'Editar propiedad'}
      </h1>

      <div className="bg-surface border border-border p-6 sm:p-8">
        <PropertyForm
          initial={property ?? undefined}
          mode={mode}
          isPending={isPending}
          submitError={submitError}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
