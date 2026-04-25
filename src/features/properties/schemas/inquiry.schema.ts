import { z } from 'zod'

export const inquirySchema = z.object({
  id: z.uuid(),
  propertyId: z.uuid(),
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().nullable(),
  message: z.string(),
  createdAt: z.string(),
})

export const inquiryFormSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>
