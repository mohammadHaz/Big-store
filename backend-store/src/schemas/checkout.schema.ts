// ─── CHECKOUT ────────────────────────────────────────────────────────────────
import { z } from 'zod'
import { addressFieldsSchema, cardFieldsSchema, cardSchema } from './customer.schema';
import { lineItemSchema } from './cart.schema';


export const checkoutBodySchema = z.object({
  cartId: z.string().optional(),
  card: cardFieldsSchema,
  address: addressFieldsSchema,
})

export const getCheckoutBodySchema = z.object({
  cartId: z.string().optional(),
})

export const submitCheckoutBodySchema = z.object({
  cartId: z.string(),
  card: cardFieldsSchema,
  address: addressFieldsSchema,
})

export const checkoutSchema = z.object({
  hasPayment: z.boolean(),
  hasShipping: z.boolean(),
  addressId: z.string(),
  payments: z.array(cardSchema).optional(),
  cardId: z.string().optional(),
  lineItems: z.array(lineItemSchema).optional(),
})