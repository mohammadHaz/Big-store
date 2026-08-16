// ─── CUSTOMER ────────────────────────────────────────────────────────────────

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  notes?: string
  acceptsMarketing?: boolean
}

export interface AddressFields {
  type: string
  firstName: string
  lastName: string
  company: string
  streetNumber: string
  apartments: string
  zipCode: string
  city: string
  country: string
}

export interface Address {
  id: string
  mask: string
}

export interface CardFields {
  cardHolder: string
  cardNumber: string
  cardExpireDate: string
  cardCvc: string
  firstName: string
  lastName: string
  company: string
  streetNumber: string
  zipCode: string
  city: string
  country: string
}

export interface Card {
  id: string
  mask: string
  provider: string
}