export interface Inquiry {
  id: string
  propertyId: string
  name: string
  email: string
  phone: string | null
  message: string
  createdAt: string
}

export interface InquiryInput {
  propertyId: string
  name: string
  email: string
  phone?: string
  message: string
}
