import { z } from 'zod'
import { supabase } from '@/shared/lib/supabase'
import type { Tables } from '@/shared/lib/database.types'
import { inquirySchema } from '../schemas/inquiry.schema'
import type { Inquiry, InquiryInput } from '../types/inquiry.types'

type InquiryRow = Tables<'inquiries'>

function mapRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    propertyId: row.property_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    createdAt: row.created_at,
  }
}

export const inquiriesService = {
  async create(input: InquiryInput): Promise<Inquiry> {
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        property_id: input.propertyId,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        message: input.message,
      })
      .select()
      .single()

    if (error) throw error
    const parsed = inquirySchema.safeParse(mapRow(data))
    if (!parsed.success) {
      console.error('[inquiriesService.create] parse error', parsed.error)
      return mapRow(data)
    }
    return parsed.data as Inquiry
  },

  async getAll(propertyId?: string): Promise<Inquiry[]> {
    let q = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (propertyId) q = q.eq('property_id', propertyId)

    const { data, error } = await q
    if (error) throw error

    const rows = (data ?? []).map(mapRow)
    const parsed = z.array(inquirySchema).safeParse(rows)
    if (!parsed.success) {
      console.error('[inquiriesService.getAll] parse error', parsed.error)
      return rows
    }
    return parsed.data as Inquiry[]
  },
}
