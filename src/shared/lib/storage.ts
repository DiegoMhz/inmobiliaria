import { supabase } from './supabase'

const BUCKET = 'property-images'

interface TransformOptions {
  width?: number
  quality?: number
}

export function getStorageUrl(path: string, opts?: TransformOptions): string {
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path, {
    transform: opts ? { width: opts.width, quality: opts.quality } : undefined,
  })
  return data.publicUrl
}
