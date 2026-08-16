// src/schemas/admin.schemas.ts

import { z } from 'zod'

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(7),
})

export const adminSignupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(7),
  secretKey: z.string().min(1),
})

// ─── PRODUCT ─────────────────────────────────────────────────────────────────

export const adminImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const adminPriceSchema = z.object({
  value: z.number().min(0),
  currencyCode: z.string().default('USD'),
  retailPrice: z.number().min(0).optional(),
})

export const adminOptionValueSchema = z.object({
  label: z.string().min(1),
  hexColors: z.array(z.string()).optional(),
})

export const adminOptionSchema = z.object({
  displayName: z.string().min(1),
  values: z.array(adminOptionValueSchema).min(1),
})

export const adminCreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  descriptionHtml: z.string().optional(),
  sku: z.string().optional(),
  slug: z.string().optional(),
  path: z.string().optional(),
  vendor: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  price: adminPriceSchema.optional(),
  images: z.array(adminImageSchema).optional(),
  options: z.array(adminOptionSchema).optional(),
})

export const adminUpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  descriptionHtml: z.string().optional(),
  sku: z.string().optional(),
  slug: z.string().optional(),
  path: z.string().optional(),
  vendor: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  price: adminPriceSchema.optional(),
})

// ─── VARIANT ─────────────────────────────────────────────────────────────────

export const adminCreateVariantSchema = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
  price: z.number().min(0).optional(),
  retailPrice: z.number().min(0).optional(),
  currencyCode: z.string().default('USD'),
  availableForSale: z.boolean().default(true),
  requiresShipping: z.boolean().default(true),
  weight: z.number().optional(),
  weightUnit: z.string().optional(),
  images: z.array(adminImageSchema).optional(),
  options: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
})

export const adminUpdateVariantSchema = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
  price: z.number().min(0).optional(),
  retailPrice: z.number().min(0).optional(),
  currencyCode: z.string().optional(),
  availableForSale: z.boolean().optional(),
  requiresShipping: z.boolean().optional(),
  weight: z.number().optional(),
  weightUnit: z.string().optional(),
})

// ─── IMAGE ───────────────────────────────────────────────────────────────────

export const adminAddImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const adminReorderImagesSchema = z.object({
  orderedIds: z.array(z.string()).min(1),
})

// ─── OPTION ──────────────────────────────────────────────────────────────────

export const adminAddOptionSchema = z.object({
  displayName: z.string().min(1),
  values: z.array(adminOptionValueSchema).min(1),
})

export const adminUpdateOptionSchema = z.object({
  displayName: z.string().min(1).optional(),
})

// ─── CATEGORY / BRAND ────────────────────────────────────────────────────────

export const adminCreateCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  path: z.string().optional(),
})

export const adminUpdateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  path: z.string().optional(),
})

export const adminCreateBrandSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  path: z.string().optional(),
})

export const adminUpdateBrandSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().optional(),
  path: z.string().optional(),
})

// ─── PAGE ────────────────────────────────────────────────────────────────────

export const adminCreatePageSchema = z.object({
  name: z.string().min(1),
  url: z.string().optional(),
  body: z.string(),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().optional(),
})

export const adminUpdatePageSchema = z.object({
  name: z.string().min(1).optional(),
  url: z.string().optional(),
  body: z.string().optional(),
  isVisible: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

// ─── ORDER ───────────────────────────────────────────────────────────────────

export const adminUpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
})

// ─── QUERY PARAMS ────────────────────────────────────────────────────────────

export const adminPaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  customerId: z.string().optional(),
})