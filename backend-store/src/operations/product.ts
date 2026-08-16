// src/operations/product.ts
// All product-related Prisma operations

import type { Product, SearchProductsBody } from '../types'
import { prisma } from '../lib/prisma'
import { NotFoundError } from '../api/middleware/errors'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Map a Prisma product record to the commerce Product type.
 */
function mapProduct(raw: any): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml ?? undefined,
    sku: raw.sku ?? undefined,
    slug: raw.slug,
    path: raw.path,
    vendor: raw.vendor ?? undefined,
    images: raw.images.map((img: any) => ({
      url: img.url,
      alt: img.alt ?? undefined,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
    })),
    price: raw.price
      ? {
          value: raw.price.value,
          currencyCode: raw.price.currencyCode,
          retailPrice: raw.price.retailPrice ?? undefined,
        }
      : { value: 0 },
    options: raw.options.map((opt: any) => ({
      id: opt.id,
      displayName: opt.displayName,
      values: opt.values.map((v: any) => ({
        label: v.label,
        hexColors: v.hexColors,
      })),
    })),
    variants: raw.variants.map((variant: any) => ({
      id: variant.id,
      sku: variant.sku ?? undefined,
      name: variant.name ?? undefined,
      availableForSale: variant.availableForSale,
      requiresShipping: variant.requiresShipping,
      options: variant.selectedOptions?.map((so: any) => ({
        id: so.optionValueId ?? undefined,
        displayName: so.name,
        values: [{ label: so.value }],
      })) ?? [],
      price: variant.priceValue != null
        ? { value: variant.priceValue, currencyCode: variant.priceCurrency ?? 'USD' }
        : undefined,
      retailPrice: variant.retailPrice != null
        ? { value: variant.retailPrice, currencyCode: variant.priceCurrency ?? 'USD' }
        : undefined,
      image: variant.images[0]
        ? { url: variant.images[0].url, alt: variant.images[0].alt ?? undefined }
        : undefined,
    })),
  }
}

/** Standard Prisma include for a full product */
const productInclude = {
  images: true,
  price: true,
  options: { include: { values: true } },
  variants: {
    include: {
      images: true,
      selectedOptions: { include: { optionValue: true } },
    },
  },
} as const

// ─── OPERATIONS ──────────────────────────────────────────────────────────────

export async function getProduct(variables: {
  path?: string
  slug?: string
}): Promise<{ product?: Product }> {
  const where = variables.path
    ? { path: variables.path }
    : { slug: variables.slug! }

  const raw = await prisma.product.findUnique({
    where,
    include: productInclude,
  })

  return { product: raw ? mapProduct(raw) : undefined }
}

export async function getAllProducts(variables?: {
  relevance?: 'featured' | 'best_selling' | 'newest'
  ids?: string[]
  first?: number
}): Promise<{ products: Product[] }> {
  const orderBy =
    variables?.relevance === 'newest'
      ? { createdAt: 'desc' as const }
      : { name: 'asc' as const }

  const raws = await prisma.product.findMany({
    where: variables?.ids ? { id: { in: variables.ids } } : undefined,
    take: variables?.first ?? 100,
    orderBy,
    include: productInclude,
  })

  return { products: raws.map(mapProduct) }
}

export async function getAllProductPaths(variables?: {
  first?: number
}): Promise<{ products: Array<{ path?: string }> }> {
  const raws = await prisma.product.findMany({
    take: variables?.first ?? 1000,
    select: { path: true },
  })
  return { products: raws }
}

export async function searchProducts(
  body: SearchProductsBody
): Promise<{ products: Product[]; found: boolean }> {
  const { search, categoryId, brandId, sort } = body

  // Build where clause
  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Build orderBy
  let orderBy: any = { name: 'asc' }
  if (sort === 'price-asc') orderBy = { price: { value: 'asc' } }
  if (sort === 'price-desc') orderBy = { price: { value: 'desc' } }
  if (sort === 'latest-desc') orderBy = { createdAt: 'desc' }

  const raws = await prisma.product.findMany({
    where,
    orderBy,
    include: productInclude,
  })

  return {
    products: raws.map(mapProduct),
    found: raws.length > 0,
  }
}