export const PROPERTY_TYPE = {
  HOUSE: 'house',
  APARTMENT: 'apartment',
  PENTHOUSE: 'penthouse',
  VILLA: 'villa',
  ESTATE: 'estate',
} as const
export type PropertyType = (typeof PROPERTY_TYPE)[keyof typeof PROPERTY_TYPE]

export const PROPERTY_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  RESERVED: 'reserved',
  DRAFT: 'draft',
} as const
export type PropertyStatus = (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS]

export interface Property {
  id: string
  title: string
  description: string
  price: number
  currency: 'USD' | 'EUR' | 'ARS'
  location: string
  type: PropertyType
  bedrooms: number
  bathrooms: number
  sqm: number
  images: string[]
  status: PropertyStatus
  featured: boolean
  createdAt: string
  updatedAt: string
}
