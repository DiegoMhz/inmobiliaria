import type { PropertyType } from './property.types'

export interface PropertyFilters {
  priceMin: number | null
  priceMax: number | null
  types: PropertyType[]
  bedroomsMin: number | null
  location: string | null
  page: number
}

export const DEFAULT_FILTERS: PropertyFilters = {
  priceMin: null,
  priceMax: null,
  types: [],
  bedroomsMin: null,
  location: null,
  page: 1,
}
