// src/operations/wishlist.ts

import prisma from '../lib/prisma'
import { Wishlist, WishlistItemBody } from '../types'
import { NotFoundError } from '../api/middleware/errors'

const wishlistInclude = {
  items: {
    include: {
      product: {
        include: {
          images: true,
          price: true,
          options: { include: { values: true } },
          variants: { include: { images: true } },
        },
      },
    },
  },
} as const

function mapWishlist(raw: any): Wishlist {
  return {
    id: raw.id,
    token: raw.token,
    items: raw.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        slug: item.product.slug,
        path: item.product.path,
        images: item.product.images.map((img: any) => ({ url: img.url, alt: img.alt ?? undefined })),
        price: item.product.price
          ? { value: item.product.price.value, currencyCode: item.product.price.currencyCode }
          : { value: 0 },
        options: [],
        variants: [],
      },
    })),
  }
}

export async function getWishlist(customerId: string): Promise<Wishlist | null> {
  const raw = await prisma.wishlist.findFirst({
    where: { customerId },
    include: wishlistInclude,
  })
  return raw ? mapWishlist(raw) : null
}

export async function addWishlistItem(
  customerId: string | undefined,
  item: WishlistItemBody
): Promise<Wishlist> {
  let wishlist = customerId
    ? await prisma.wishlist.findFirst({ where: { customerId } })
    : item.wishlistToken
    ? await prisma.wishlist.findUnique({ where: { token: item.wishlistToken } })
    : null

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { customerId: customerId ?? null },
    })
  }

  const existing = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId: item.productId, variantId: item.variantId },
  })

  if (!existing) {
    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId: item.productId, variantId: item.variantId },
    })
  }

  const updated = await prisma.wishlist.findUnique({
    where: { id: wishlist.id },
    include: wishlistInclude,
  })
  return mapWishlist(updated!)
}

export async function removeWishlistItem(
  wishlistId: string,
  itemId: string
): Promise<Wishlist> {
  const item = await prisma.wishlistItem.findFirst({ where: { id: itemId, wishlistId } })
  if (!item) throw new NotFoundError('Wishlist item')

  await prisma.wishlistItem.delete({ where: { id: itemId } })

  const updated = await prisma.wishlist.findUnique({
    where: { id: wishlistId },
    include: wishlistInclude,
  })
  return mapWishlist(updated!)
}



