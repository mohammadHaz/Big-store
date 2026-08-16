// ─── SITE ────────────────────────────────────────────────────────────────────
import { z } from 'zod'


export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  path: z.string(),
})

export const brandSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  path: z.string(),
})

export const siteInfoSchema = z.object({
  categories: z.array(categorySchema),
  brands: z.array(brandSchema),
})

export const pageSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().optional(),
  body: z.string(),
  is_visible: z.boolean().optional(),
  sort_order: z.number().optional(),
})