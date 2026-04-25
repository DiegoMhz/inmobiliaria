import { supabase } from '@/shared/lib/supabase'

export interface CuradorSettings {
  photo_url: string | null
  bio: string
}

const BUCKET = 'property-images'
const PHOTO_PATH = 'curator/photo'

export const curadorService = {
  async getSettings(): Promise<CuradorSettings> {
    const { data } = await supabase
      .from('curador_settings')
      .select('photo_url, bio')
      .single()
    return data ?? { photo_url: null, bio: '' }
  },

  async updateSettings(settings: CuradorSettings): Promise<void> {
    const { error } = await supabase
      .from('curador_settings')
      .update(settings)
      .eq('id', 1)
    if (error) throw error
  },

  async uploadPhoto(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${PHOTO_PATH}.${ext}`
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) throw error
    return path
  },
}
