import { useState, useEffect } from 'react'
import { Spinner } from '@/shared/ui/Spinner'
import { Button } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Textarea'
import { getStorageUrl } from '@/shared/lib/storage'
import { curadorService } from './api/curador.service'
import type { CuradorSettings } from './api/curador.service'

export function Component() {
  const [settings, setSettings] = useState<CuradorSettings | null>(null)
  const [bio, setBio] = useState('')
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    curadorService
      .getSettings()
      .then((s) => {
        setSettings(s)
        setBio(s.bio)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError(`"${file.name}" supera el límite de 5 MB.`)
      return
    }
    setError(null)
    setNewPhoto(file)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      let photoPath = settings?.photo_url ?? null
      if (newPhoto) {
        photoPath = await curadorService.uploadPhoto(newPhoto)
      }
      await curadorService.updateSettings({ photo_url: photoPath, bio })
      setSettings({ photo_url: photoPath, bio })
      setNewPhoto(null)
      setPreview(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const displayPhoto =
    preview ??
    (settings?.photo_url ? getStorageUrl(settings.photo_url, { width: 300, quality: 80 }) : null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <h1 className="font-serif text-3xl text-text-primary">El Asesor</h1>

      <form onSubmit={handleSubmit} className="bg-surface border border-border p-6 sm:p-8 flex flex-col gap-6">
        {/* Foto */}
        <div className="flex flex-col gap-3">
          <span className="text-caption text-text-secondary font-medium tracking-wide uppercase font-sans">
            Foto del asesor
          </span>

          {displayPhoto && (
            <div className="w-32 h-40 overflow-hidden bg-surface-hover shrink-0">
              <img
                src={displayPhoto}
                alt="Vista previa"
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(100%)' }}
              />
            </div>
          )}

          <label className="cursor-pointer inline-flex w-fit">
            <span className="border border-border px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors duration-200 font-sans">
              {displayPhoto ? 'Cambiar foto' : 'Subir foto'}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="sr-only"
            />
          </label>
          <p className="text-caption text-text-tertiary font-sans">JPG, PNG o WebP · Máximo 5 MB</p>
        </div>

        {/* Bio */}
        <Textarea
          id="bio"
          label="Descripción / Bio"
          rows={6}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-caption text-red-400 font-sans">
            {error}
          </p>
        )}
        {success && (
          <p className="text-caption text-green-400 font-sans">
            Cambios guardados correctamente.
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
