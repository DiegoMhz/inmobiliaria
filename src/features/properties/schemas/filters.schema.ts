import { z } from 'zod'
import { PROPERTY_TYPE } from '../types/property.types'

const propertyTypeValues = Object.values(PROPERTY_TYPE) as [string, ...string[]]

export const filtersSchema = z.object({
  priceMin: z.coerce.number().min(0).optional().catch(undefined),
  priceMax: z.coerce.number().min(0).optional().catch(undefined),
  types: z
    .union([z.enum(propertyTypeValues), z.array(z.enum(propertyTypeValues))])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .optional()
    .catch([]),
  bedroomsMin: z.coerce.number().int().min(1).optional().catch(undefined),
  location: z.string().min(1).optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(1),
})

export type ParsedFilters = z.infer<typeof filtersSchema>

export function parseFiltersFromSearch(search: string): ParsedFilters {
  const params = Object.fromEntries(new URLSearchParams(search))
  const result = filtersSchema.safeParse(params)
  return result.success ? result.data : {}
}

export function filtersToSearch(filters: ParsedFilters): string {
  const params = new URLSearchParams()
  if (filters.priceMin != null) params.set('priceMin', String(filters.priceMin))
  if (filters.priceMax != null) params.set('priceMax', String(filters.priceMax))
  if (filters.types?.length) filters.types.forEach((t) => params.append('types', t))
  if (filters.bedroomsMin != null) params.set('bedroomsMin', String(filters.bedroomsMin))
  if (filters.location) params.set('location', filters.location)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  return params.toString()
}
