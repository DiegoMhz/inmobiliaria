import { useUIStore } from '@/shared/stores/ui.store'
import { getStorageUrl } from '@/shared/lib/storage'

interface GalleryProps {
  images: string[]
}

export function Gallery({ images }: GalleryProps) {
  const openLightbox = useUIStore((s) => s.openLightbox)

  const lightboxUrls = images.map((p) => getStorageUrl(p, { width: 1600, quality: 90 }))

  const open = (index: number) => openLightbox(lightboxUrls, index)

  if (images.length === 0) return null

  const mainUrl = getStorageUrl(images[0]!, { width: 800, quality: 85 })

  if (images.length === 1) {
    return (
      <div className="w-full aspect-video overflow-hidden">
        <img
          src={mainUrl}
          alt="Imagen de la propiedad"
          className="w-full h-full object-cover cursor-pointer hover:scale-[1.02] transition-transform duration-500"
          onClick={() => open(0)}
        />
      </div>
    )
  }

  const thumbCount = Math.min(images.length - 1, 3)
  // Images not visible at all (beyond the 3 thumbs)
  const hiddenCount = images.length - 1 - thumbCount

  return (
    <div className="flex gap-1 aspect-[16/9]">
      {/* Main image — 2/3 */}
      <div className="w-2/3 shrink-0 overflow-hidden cursor-pointer" onClick={() => open(0)}>
        <img
          src={mainUrl}
          alt="Imagen principal de la propiedad"
          className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
        />
      </div>

      {/* Thumbnails column — 1/3 */}
      <div className="flex flex-col gap-1 flex-1">
        {Array.from({ length: thumbCount }, (_, i) => {
          const imgIndex = i + 1
          const thumbUrl = getStorageUrl(images[imgIndex] as string, { width: 400, quality: 75 })
          const isLastThumb = i === thumbCount - 1
          const showOverlay = isLastThumb && hiddenCount > 0

          return (
            <div
              key={imgIndex}
              className="relative flex-1 overflow-hidden cursor-pointer"
              onClick={() => open(imgIndex)}
            >
              <img
                src={thumbUrl}
                alt={`Imagen ${imgIndex + 1} de la propiedad`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              {showOverlay && (
                <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                  <span className="text-white font-medium text-xl tracking-wide">
                    +{hiddenCount + 1}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
