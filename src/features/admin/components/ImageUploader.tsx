import { useRef, useState } from 'react'
import { getStorageUrl } from '@/shared/lib/storage'
import { cn } from '@/shared/lib/cn'

interface ImageUploaderProps {
  value: string[]
  onChange: (paths: string[]) => void
  newFiles: File[]
  onNewFiles: (files: File[]) => void
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024

export function ImageUploader({ value, onChange, newFiles, onNewFiles }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)

  function handleFiles(fileList: FileList) {
    setSizeError(null)
    const valid: File[] = []
    let errorMsg: string | null = null

    for (const file of Array.from(fileList)) {
      if (file.size > MAX_SIZE_BYTES) {
        errorMsg = `"${file.name}" supera el límite de 5MB`
      } else {
        valid.push(file)
      }
    }

    if (errorMsg) setSizeError(errorMsg)
    if (valid.length) onNewFiles([...newFiles, ...valid])
  }

  function removeExisting(path: string) {
    onChange(value.filter((p) => p !== path))
  }

  function removeNew(file: File) {
    onNewFiles(newFiles.filter((f) => f !== file))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 border border-border text-text-secondary font-sans text-sm hover:border-accent hover:text-accent transition-colors"
        >
          Agregar imágenes
        </button>
        {sizeError && (
          <p role="alert" className="text-caption text-red-400">
            {sizeError}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(e.target.files)
            e.target.value = ''
          }
        }}
      />

      {(value.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((path) => (
            <div key={path} className="relative group aspect-square">
              <img
                src={getStorageUrl(path, { width: 200, quality: 70 })}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeExisting(path)}
                className={cn(
                  'absolute top-1 right-1 w-6 h-6 bg-black/70 text-white text-xs',
                  'flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
                )}
                aria-label="Eliminar imagen"
              >
                ✕
              </button>
            </div>
          ))}

          {newFiles.map((file, i) => (
            <div key={i} className="relative group aspect-square">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeNew(file)}
                className={cn(
                  'absolute top-1 right-1 w-6 h-6 bg-black/70 text-white text-xs',
                  'flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity',
                )}
                aria-label="Eliminar imagen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
