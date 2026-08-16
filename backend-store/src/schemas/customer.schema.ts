// ─── CUSTOMER ────────────────────────────────────────────────────────────────
import { z } from 'zod'


export const customerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
  acceptsMarketing: z.boolean().optional(),
})

export const addressFieldsSchema = z.object({
  type: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().default(''),
  streetNumber: z.string(),
  apartments: z.string().default(''),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
})

export const addressSchema = z.object({
  id: z.string(),
  mask: z.string(),
})

export const addAddressBodySchema = z.object({
  cartId: z.string().optional(),
  item: addressFieldsSchema,
})

export const updateAddressBodySchema = z.object({
  cartId: z.string().optional(),
  itemId: z.string(),
  item: addressFieldsSchema,
})

export const deleteAddressBodySchema = z.object({
  cartId: z.string().optional(),
  itemId: z.string(),
})

export const cardFieldsSchema = z.object({
  cardHolder: z.string(),
  cardNumber: z.string().length(16),
  cardExpireDate: z.string().regex(/^\d{2}\/\d{2}$/),
  cardCvc: z.string().length(3),
  firstName: z.string(),
  lastName: z.string(),
  company: z.string().default(''),
  streetNumber: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
})

export const cardSchema = z.object({
  id: z.string(),
  mask: z.string(),
  provider: z.string(),
})

export const addCardBodySchema = z.object({
  cartId: z.string().optional(),
  item: cardFieldsSchema,
})

export const updateCardBodySchema = z.object({
  cartId: z.string().optional(),
  itemId: z.string(),
  item: cardFieldsSchema,
})

export const deleteCardBodySchema = z.object({
  cartId: z.string().optional(),
  itemId: z.string(),
})