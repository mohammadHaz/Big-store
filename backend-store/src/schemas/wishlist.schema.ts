// ─── WISHLIST ────────────────────────────────────────────────────────────────
import { z } from 'zod'
import { productSchema } from './product.schema'

export const wishlistItemBodySchema = z.object({
  variantId: z.string(),
  productId: z.string(),
  wishlistToken: z.string().optional(),
})

export const wishlistItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  variantId: z.string(),
  product: productSchema,
})

export const wishlistSchema = z.object({
  id: z.string(),
  items: z.array(wishlistItemSchema),
  token: z.string().optional(),
})

export const getWishlistBodySchema = z.object({
  customerToken: z.string().optional(),
  includeProducts: z.boolean().optional(),
})

export const addWishlistItemBodySchema = z.object({
  customerToken: z.string().optional(),
  item: wishlistItemBodySchema,
})

export const removeWishlistItemBodySchema = z.object({
  customerToken: z.string().optional(),
  itemId: z.string(),
  wishlistToken: z.string().optional(),
})