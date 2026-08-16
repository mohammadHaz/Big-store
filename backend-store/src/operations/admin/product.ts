// src/operations/admin/product.ts

import prisma from '../../lib/prisma'
import { NotFoundError } from '../../api/middleware/errors'
import type {
  AdminCreateProductBody,
  AdminUpdateProductBody,
  AdminCreateVariantBody,
  AdminUpdateVariantBody,
} from '../../types/admin.types'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const productInclude = {
  images: true,
  price: true,
  options: { include: { values: true } },
  variants: {
    include: {
      images: true,
      selectedOptions: true,
    },
  },
} as const

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function adminGetProducts(params?: {
  search?: string
  categoryId?: string
  brandId?: string
  skip?: number
  take?: number
}) {
  const { search, categoryId, brandId, skip = 0, take = 20 } = params ?? {}

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (categoryId) where.categoryId = categoryId
  if (brandId) where.brandId = brandId

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: productInclude,
    }),
  ])

  return { products, total }
}

export async function adminGetProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: productInclude,
  })
  if (!product) throw new NotFoundError('Product')
  return product
}

export async function adminCreateProduct(data: AdminCreateProductBody) {
  const slug = data.slug ?? slugify(data.name)
  const path = data.path ?? `/${slug}`

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      descriptionHtml: data.descriptionHtml,
      sku: data.sku,
      slug,
      path,
      vendor: data.vendor,
      categoryId: data.categoryId,
      brandId: data.brandId,

      // Price
      price: data.price
        ? {
            create: {
              value: data.price.value,
              currencyCode: data.price.currencyCode ?? 'USD',
              retailPrice: data.price.retailPrice,
            },
          }
        : undefined,

      // Images
      images: data.images?.length
        ? {
            create: data.images.map((img, i) => ({
              url: img.url,
              alt: img.alt,
              width: img.width,
              height: img.height,
              sortOrder: i,
            })),
          }
        : undefined,

      // Options (e.g. Color, Size)
      options: data.options?.length
        ? {
            create: data.options.map((opt) => ({
              displayName: opt.displayName,
              values: {
                create: opt.values.map((v) => ({
                  label: v.label,
                  hexColors: v.hexColors ?? [],
                })),
              },
            })),
          }
        : undefined,
    },
    include: productInclude,
  })

  return product
}

export async function adminUpdateProduct(id: string, data: AdminUpdateProductBody) {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Product')

  const slug = data.slug ?? (data.name ? slugify(data.name) : existing.slug)
  const path = data.path ?? `/${slug}`

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      descriptionHtml: data.descriptionHtml,
      sku: data.sku,
      slug,
      path,
      vendor: data.vendor,
      categoryId: data.categoryId,
      brandId: data.brandId,

      // Update price
      price: data.price
        ? {
            upsert: {
              create: {
                value: data.price.value,
                currencyCode: data.price.currencyCode ?? 'USD',
                retailPrice: data.price.retailPrice,
              },
              update: {
                value: data.price.value,
                currencyCode: data.price.currencyCode ?? 'USD',
                retailPrice: data.price.retailPrice,
              },
            },
          }
        : undefined,
    },
    include: productInclude,
  })

  return product
}

export async function adminDeleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Product')
  await prisma.product.delete({ where: { id } })
}

// ─── IMAGES ──────────────────────────────────────────────────────────────────

export async function adminAddProductImage(
  productId: string,
  data: { url: string; alt?: string; width?: number; height?: number }
) {
  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing) throw new NotFoundError('Product')

  const count = await prisma.productImage.count({ where: { productId } })

  return prisma.productImage.create({
    data: { productId, sortOrder: count, ...data },
  })
}

export async function adminDeleteProductImage(productId: string, imageId: string) {
  const image = await prisma.productImage.findFirst({ where: { id: imageId, productId } })
  if (!image) throw new NotFoundError('Image')
  await prisma.productImage.delete({ where: { id: imageId } })
}

export async function adminReorderProductImages(
  productId: string,
  orderedIds: string[]
) {
  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing) throw new NotFoundError('Product')

  await Promise.all(
    orderedIds.map((imageId, index) =>
      prisma.productImage.update({
        where: { id: imageId },
        data: { position: index },
      })
    )
  )

  return prisma.productImage.findMany({
    where: { productId },
    orderBy: { position: 'asc' },
  })
}

// ─── OPTIONS ─────────────────────────────────────────────────────────────────

export async function adminAddProductOption(
  productId: string,
  data: { displayName: string; values: { label: string; hexColors?: string[] }[] }
) {
  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing) throw new NotFoundError('Product')

  return prisma.productOption.create({
    data: {
      productId,
      displayName: data.displayName,
      values: {
        create: data.values.map((v) => ({
          label: v.label,
          hexColors: v.hexColors ?? [],
        })),
      },
    },
    include: { values: true },
  })
}

export async function adminUpdateProductOption(
  productId: string,
  optionId: string,
  data: { displayName?: string }
) {
  const existing = await prisma.productOption.findFirst({ where: { id: optionId, productId } })
  if (!existing) throw new NotFoundError('Option')

  return prisma.productOption.update({
    where: { id: optionId },
    data: { displayName: data.displayName },
    include: { values: true },
  })
}

export async function adminDeleteProductOption(productId: string, optionId: string) {
  const existing = await prisma.productOption.findFirst({ where: { id: optionId, productId } })
  if (!existing) throw new NotFoundError('Option')
  await prisma.productOption.delete({ where: { id: optionId } })
}

// ─── VARIANTS ────────────────────────────────────────────────────────────────

export async function adminGetVariants(productId: string) {
  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing) throw new NotFoundError('Product')

  return prisma.productVariant.findMany({
    where: { productId },
    include: { images: true, selectedOptions: true },
  })
}

export async function adminCreateVariant(productId: string, data: AdminCreateVariantBody) {
  const existing = await prisma.product.findUnique({ where: { id: productId } })
  if (!existing) throw new NotFoundError('Product')

  return prisma.productVariant.create({
    data: {
      productId,
      sku: data.sku,
      name: data.name,
      priceValue: data.price,
      retailPrice: data.retailPrice,
      priceCurrency: data.currencyCode ?? 'USD',
      availableForSale: data.availableForSale ?? true,
      requiresShipping: data.requiresShipping ?? true,
      weight: data.weight,
      weightUnit: data.weightUnit,

      images: data.images?.length
        ? { create: data.images.map((img) => ({ url: img.url, alt: img.alt })) }
        : undefined,

      selectedOptions: data.options?.length
        ? { create: data.options.map((o) => ({ name: o.name, value: o.value })) }
        : undefined,
    },
    include: { images: true, selectedOptions: true },
  })
}

export async function adminUpdateVariant(
  productId: string,
  variantId: string,
  data: AdminUpdateVariantBody
) {
  const existing = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  })
  if (!existing) throw new NotFoundError('Variant')

  return prisma.productVariant.update({
    where: { id: variantId },
    data: {
      sku: data.sku,
      name: data.name,
      priceValue: data.price,
      retailPrice: data.retailPrice,
      priceCurrency: data.currencyCode,
      availableForSale: data.availableForSale,
      requiresShipping: data.requiresShipping,
      weight: data.weight,
      weightUnit: data.weightUnit,
    },
    include: { images: true, selectedOptions: true },
  })
}

export async function adminDeleteVariant(productId: string, variantId: string) {
  const existing = await prisma.productVariant.findFirst({
    where: { id: variantId, productId },
  })
  if (!existing) throw new NotFoundError('Variant')
  await prisma.productVariant.delete({ where: { id: variantId } })
}