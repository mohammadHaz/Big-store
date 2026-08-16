// ─── CART ────────────────────────────────────────────────────────────────────
import { z } from 'zod'
import { imageSchema, measurementSchema ,discountSchema } from './common.schema';


export const selectedOptionSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  value: z.string(),
})

export const cartItemBodySchema = z.object({
  variantId: z.string(),
  productId: z.string().optional(),
  quantity: z.number().min(1).optional(),
  optionsSelected: z.array(selectedOptionSchema).optional(),
})

export const getCartBodySchema = z.object({
  cartId: z.string().optional(),
})

export const addItemBodySchema = z.object({
  cartId: z.string().optional(),
  item: cartItemBodySchema,
})

export const updateItemBodySchema = z.object({
  cartId: z.string(),
  itemId: z.string(),
  item: cartItemBodySchema,
})

export const removeItemBodySchema = z.object({
  cartId: z.string(),
  itemId: z.string(),
})

export const cartProductVariantSchema = z.object({
  id: z.string(),
  sku: z.string().optional(),
  name: z.string(),
  price: z.number(),
  listPrice: z.number(),
  availableForSale: z.boolean().optional(),
  requiresShipping: z.boolean().optional(),
  image: imageSchema.optional(),
  weight: measurementSchema.optional(),
  height: measurementSchema.optional(),
  width: measurementSchema.optional(),
  depth: measurementSchema.optional(),
})

export const lineItemSchema = z.object({
  id: z.string(),
  variantId: z.string(),
  productId: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  discounts: z.array(discountSchema),
  path: z.string(),
  variant: cartProductVariantSchema,
  options: z.array(selectedOptionSchema).optional(),
})

export const cartSchema = z.object({
  id: z.string(),
  customerId: z.string().optional(),
  url: z.string().optional(),
  email: z.string().optional(),
  createdAt: z.string(),
  currency: z.object({ code: z.string() }),
  taxesIncluded: z.boolean(),
  lineItems: z.array(lineItemSchema),
  lineItemsSubtotalPrice: z.number(),
  subtotalPrice: z.number(),
  totalPrice: z.number(),
  discounts: z.array(discountSchema).optional(),
})