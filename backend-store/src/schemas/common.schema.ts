// ─── COMMON ──────────────────────────────────────────────────────────────────
import { z } from 'zod'


export const discountSchema = z.object({
  value: z.number(),
})

export const measurementSchema = z.object({
  value: z.number(),
  unit: z.enum(['KILOGRAMS', 'GRAMS', 'POUNDS', 'OUNCES']),
})

export const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})