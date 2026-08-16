// ─── PRODUCT ─────────────────────────────────────────────────────────────────
import { z } from 'zod'
import { imageSchema } from './common.schema';


export const productPriceSchema = z.object({
  value: z.number(),
  currencyCode: z.string().optional(),
  retailPrice: z.number().optional(),
})

export const productOptionValueSchema = z.object({
  label: z.string(),
  hexColors: z.array(z.string()).optional(),
})

export const productOptionSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  values: z.array(productOptionValueSchema),
})

export const productVariantSchema = z.object({
  id: z.string(),
  sku: z.string().optional(),
  name: z.string().optional(),
  options: z.array(productOptionSchema),
  price: productPriceSchema.optional(),
  retailPrice: productPriceSchema.optional(),
  availableForSale: z.boolean().optional(),
  requiresShipping: z.boolean().optional(),
  image: imageSchema.optional(),
})

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  descriptionHtml: z.string().optional(),
  sku: z.string().optional(),
  slug: z.string().optional(),
  path: z.string().optional(),
  images: z.array(imageSchema),
  variants: z.array(productVariantSchema),
  price: productPriceSchema,
  options: z.array(productOptionSchema),
  vendor: z.string().optional(),
})

export const productsPathsSchema = z.array(
  z.object({ path: z.string().optional() })
)

export const searchProductBodySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  sort: z.string().optional(),
  locale: z.string().optional(),
})

export const searchProductsSchema = z.object({
  products: z.array(productSchema),
  found: z.boolean(),
})