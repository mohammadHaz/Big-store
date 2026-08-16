
// src/operations/cart.ts

import prisma from '../lib/prisma'
import { Cart, CartItemBody } from '../types'
import { NotFoundError } from '../api/middleware/errors'
import { withOperation, OUTPUT_SCHEMAS } from '../lib/operation-wrapper'

const cartInclude = {
  lineItems: {
    include: {
      variant: { include: { images: true } },
      product: true,
      discounts: true,
      selectedOptions: true,
    },
  },
  discounts: true,
} as const

function mapCart(raw: any): Cart {
  return {
    id: raw.id,
    customerId: raw.customerId ?? undefined,
    url: raw.url ?? undefined,
    email: raw.email ?? undefined,
    createdAt: raw.createdAt.toISOString(),
    currency: { code: raw.currencyCode },
    taxesIncluded: raw.taxesIncluded,
    lineItemsSubtotalPrice: raw.lineItemsSubtotalPrice,
    subtotalPrice: raw.subtotalPrice,
    totalPrice: raw.totalPrice,
    discounts: raw.discounts.map((d: any) => ({ value: d.value })),
    lineItems: raw.lineItems.map((li: any) => ({
      id: li.id,
      variantId: li.variantId,
      productId: li.productId,
      name: li.name,
      quantity: li.quantity,
      path: li.path ?? `/${li.product.slug}`,
      discounts: li.discounts.map((d: any) => ({ value: d.value })),
      variant: {
        id: li.variant.id,
        sku: li.variant.sku ?? undefined,
        name: li.variant.name ?? li.product.name,
        price: li.variant.priceValue ?? 0,
        listPrice: li.variant.retailPrice ?? li.variant.priceValue ?? 0,
        availableForSale: li.variant.availableForSale,
        requiresShipping: li.variant.requiresShipping,
        image: li.variant.images[0] ? { url: li.variant.images[0].url } : undefined,
      },
      options: li.selectedOptions.map((so: any) => ({
        id: so.id, name: so.name, value: so.value,
      })),
    })),
  }
}

async function recalculate(cartId: string) {
  const lineItems = await prisma.lineItem.findMany({
    where: { cartId },
    include: { variant: true },
  })
  const total = lineItems.reduce(
    (sum, li) => sum + (li.variant.priceValue ?? 0) * li.quantity,
    0
  )
  await prisma.cart.update({
    where: { id: cartId },
    data: { lineItemsSubtotalPrice: total, subtotalPrice: total, totalPrice: total },
  })
}

export async function getCart(cartId?: string) {
  return withOperation('getCart', async () => {
    if (!cartId) return null
    const raw = await prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude })
    return raw ? mapCart(raw) : null
  }, OUTPUT_SCHEMAS.getCart)
}

export async function addItem(cartId: string | undefined, item: CartItemBody) {
  return withOperation('addItem', async () => {
    let cart = cartId
      ? await prisma.cart.findUnique({ where: { id: cartId } })
      : null

    if (!cart) cart = await prisma.cart.create({ data: {} })

    const variant = await prisma.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: true },
    })
    if (!variant) throw new NotFoundError('Variant')

    const existing = await prisma.lineItem.findFirst({
      where: { cartId: cart.id, variantId: item.variantId },
    })

    if (existing) {
      await prisma.lineItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (item.quantity ?? 1) },
      })
    } else {
      await prisma.lineItem.create({
        data: {
          cartId: cart.id,
          productId: variant.productId,
          variantId: item.variantId,
          name: variant.name ?? (variant as any).product?.name ?? '',
          quantity: item.quantity ?? 1,
          path: `/${(variant as any).product?.slug ?? ''}`,
          selectedOptions: item.optionsSelected
            ? { create: item.optionsSelected.map((o) => ({ name: o.name, value: o.value })) }
            : undefined,
        },
      })
    }

    await recalculate(cart.id)
    const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: cartInclude })
    return mapCart(updated!)
  }, OUTPUT_SCHEMAS.addItem)
}

export async function updateItem(cartId: string, itemId: string, item: CartItemBody) {
  return withOperation('updateItem', async () => {
    const li = await prisma.lineItem.findFirst({ where: { id: itemId, cartId } })
    if (!li) throw new NotFoundError('Line item')

    await prisma.lineItem.update({
      where: { id: itemId },
      data: { quantity: item.quantity ?? li.quantity, variantId: item.variantId ?? li.variantId },
    })

    await recalculate(cartId)
    const updated = await prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude })
    return mapCart(updated!)
  }, OUTPUT_SCHEMAS.updateItem)
}

export async function removeItem(cartId: string, itemId: string) {
  return withOperation('removeItem', async () => {
    const li = await prisma.lineItem.findFirst({ where: { id: itemId, cartId } })
    if (!li) throw new NotFoundError('Line item')

    await prisma.lineItem.delete({ where: { id: itemId } })
    await recalculate(cartId)
    const updated = await prisma.cart.findUnique({ where: { id: cartId }, include: cartInclude })
    return mapCart(updated!)
  }, OUTPUT_SCHEMAS.removeItem)
}
