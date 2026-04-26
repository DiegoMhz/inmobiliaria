import { z } from 'zod'
import { PROPERTY_TYPE, PROPERTY_STATUS } from '../types/property.types'
import type { PropertyType, PropertyStatus } from '../types/property.types'

const propertyTypeValues = Object.values(PROPERTY_TYPE) as [PropertyType, ...PropertyType[]]
const propertyStatusValues = Object.values(PROPERTY_STATUS) as [PropertyStatus, ...PropertyStatus[]]

export const propertySchema = z.object({
  id: z.uuid(),
  title: z.string().min(3),
  description: z.string(),
  price: z.number().min(0),
  currency: z.enum(['USD', 'EUR', 'ARS']),
  location: z.string().min(1),
  type: z.enum(propertyTypeValues),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  sqm: z.number().min(0),
  images: z.array(z.string()),
  status: z.enum(propertyStatusValues),
  featured: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type PropertyFormInput = {
  title: string
  description: string
  price: number
  currency: 'USD' | 'EUR' | 'ARS'
  location: string
  type: string
  bedrooms: number
  bathrooms: number
  sqm: number
  status: string
  featured: boolean
}

export const propertyFormSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(20, 'Mínimo 20 caracteres'),
  price: z.number({ error: 'Ingresá un precio válido' }).min(0),
  currency: z.enum(['USD', 'EUR', 'ARS']),
  location: z.string().min(3, 'Mínimo 3 caracteres'),
  type: z.enum(propertyTypeValues, { error: 'Seleccioná un tipo' }),
  bedrooms: z.number().int().min(0).max(20),
  bathrooms: z.number().int().min(0).max(20),
  sqm: z.number().min(0),
  status: z.enum(propertyStatusValues),
  featured: z.boolean(),
})
