import { z } from 'zod'
import { supabase } from '@/shared/lib/supabase'
import type { Tables } from '@/shared/lib/database.types'
import { propertySchema } from '../schemas/property.schema'
import type { Property, PropertyType, PropertyStatus } from '../types/property.types'
import type { ParsedFilters } from '../schemas/filters.schema'
import { MOCK_PROPERTIES } from './mock-data'

const PAGE_SIZE = 12
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

type PropertyRow = Tables<'properties'>

function mapRow(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    currency: row.currency as 'USD' | 'EUR' | 'ARS',
    location: row.location,
    type: row.type as PropertyType,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    sqm: Number(row.sqm),
    images: row.images,
    status: row.status as PropertyStatus,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toRow(input: Partial<Property>) {
  return {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.price !== undefined && { price: input.price }),
    ...(input.currency !== undefined && { currency: input.currency }),
    ...(input.location !== undefined && { location: input.location }),
    ...(input.type !== undefined && { type: input.type }),
    ...(input.bedrooms !== undefined && { bedrooms: input.bedrooms }),
    ...(input.bathrooms !== undefined && { bathrooms: input.bathrooms }),
    ...(input.sqm !== undefined && { sqm: input.sqm }),
    ...(input.images !== undefined && { images: input.images }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.featured !== undefined && { featured: input.featured }),
  }
}

function applyMockFilters(filters: ParsedFilters, page: number) {
  let results = MOCK_PROPERTIES.filter((p) => p.status === 'active')
  if (filters.priceMin != null) results = results.filter((p) => p.price >= filters.priceMin!)
  if (filters.priceMax != null) results = results.filter((p) => p.price <= filters.priceMax!)
  if (filters.types?.length) results = results.filter((p) => filters.types!.includes(p.type))
  if (filters.bedroomsMin != null) results = results.filter((p) => p.bedrooms >= filters.bedroomsMin!)
  if (filters.location) results = results.filter((p) => p.location.toLowerCase().includes(filters.location!.toLowerCase()))
  const count = results.length
  const from = (page - 1) * PAGE_SIZE
  return { data: results.slice(from, from + PAGE_SIZE), count }
}

export const propertiesService = {
  async getAll(
    filters: ParsedFilters = {},
    page = 1,
  ): Promise<{ data: Property[]; count: number }> {
    if (USE_MOCK) return applyMockFilters(filters, page)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let q = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'active')

    if (filters.priceMin != null) q = q.gte('price', filters.priceMin)
    if (filters.priceMax != null) q = q.lte('price', filters.priceMax)
    if (filters.types?.length) q = q.in('type', filters.types)
    if (filters.bedroomsMin != null) q = q.gte('bedrooms', filters.bedroomsMin)
    if (filters.location) q = q.ilike('location', `%${filters.location}%`)

    q = q
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data, error, count } = await q
    if (error) throw error

    const rows = data ?? []
    const parsed = z.array(propertySchema).safeParse(rows.map(mapRow))
    if (!parsed.success) {
      console.error('[propertiesService.getAll] parse error', parsed.error)
      return { data: rows.map(mapRow), count: count ?? 0 }
    }

    return { data: parsed.data as Property[], count: count ?? 0 }
  },

  async getById(id: string): Promise<Property | null> {
    if (USE_MOCK) return MOCK_PROPERTIES.find((p) => p.id === id) ?? null

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    const parsed = propertySchema.safeParse(mapRow(data))
    if (!parsed.success) {
      console.error('[propertiesService.getById] parse error', parsed.error)
      return mapRow(data)
    }
    return parsed.data as Property
  },

  async getFeatured(limit = 6): Promise<Property[]> {
    if (USE_MOCK) return MOCK_PROPERTIES.filter((p) => p.featured && p.status === 'active').slice(0, limit)

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data ?? []).map(mapRow)
  },

  async create(input: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert(toRow(input))
      .select()
      .single()

    if (error) throw error
    return mapRow(data)
  },

  async update(id: string, patch: Partial<Property>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update(toRow(patch))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return mapRow(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) throw error
  },

  async getAllAdmin(page = 1): Promise<{ data: Property[]; count: number }> {
    if (USE_MOCK) {
      return {
        data: MOCK_PROPERTIES.slice((page - 1) * 20, page * 20),
        count: MOCK_PROPERTIES.length,
      }
    }

    const from = (page - 1) * 20
    const to = from + 19

    const { data, error, count } = await supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error
    return { data: (data ?? []).map(mapRow), count: count ?? 0 }
  },
}
