import { supabase } from '@/shared/lib/supabase'

const BUCKET = 'property-images'

export const storageService = {
  async uploadImages(propertyId: string, files: File[]): Promise<string[]> {
    const uploads = files.map(async (file) => {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${propertyId}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (error) throw error
      return path
    })
    return Promise.all(uploads)
  },

  async remove(paths: string[]): Promise<void> {
    if (!paths.length) return
    const { error } = await supabase.storage.from(BUCKET).remove(paths)
    if (error) throw error
  },
}
