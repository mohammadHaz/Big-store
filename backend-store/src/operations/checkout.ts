// src/operations/checkout.ts

import prisma from '../lib/prisma'
import { Checkout, CheckoutBody } from '../types'
import { NotFoundError, AppError } from '../api/middleware/errors'
import { addAddress, addCard } from './customer'

const checkoutInclude = {
  cart: {
    include: {
      lineItems: {
        include: {
          variant: { include: { images: true } },
          product: true,
          discounts: true,
          selectedOptions: true,
        },
      },
    },
  },
  address: true,
  card: true,
} as const

function mapCheckout(raw: any): Checkout {
  const lineItems = raw.cart?.lineItems?.map((li: any) => ({
    id: li.id,
    variantId: li.variantId,
    productId: li.productId,
    name: li.name,
    quantity: li.quantity,
    path: li.path ?? '',
    discounts: li.discounts.map((d: any) => ({ value: d.value })),
    variant: {
      id: li.variant.id,
      name: li.variant.name ?? li.product.name,
      price: li.variant.priceValue ?? 0,
      listPrice: li.variant.retailPrice ?? li.variant.priceValue ?? 0,
      availableForSale: li.variant.availableForSale,
      requiresShipping: li.variant.requiresShipping,
      image: li.variant.images[0] ? { url: li.variant.images[0].url } : undefined,
    },
    options: li.selectedOptions.map((so: any) => ({
      id: so.id,
      name: so.name,
      value: so.value,
    })),
  })) ?? []

  return {
    hasPayment: raw.hasPayment,
    hasShipping: raw.hasShipping,
    addressId: raw.addressId ?? '',
    cardId: raw.cardId ?? undefined,
    payments: raw.card
      ? [{ id: raw.card.id, mask: raw.card.mask, provider: raw.card.provider }]
      : undefined,
    lineItems,
  }
}

export async function getCheckout(cartId?: string): Promise<Checkout | null> {
  if (!cartId) return null
  const raw = await prisma.checkout.findUnique({
    where: { cartId },
    include: checkoutInclude,
  })
  return raw ? mapCheckout(raw) : null
}

export async function submitCheckout(body: CheckoutBody): Promise<Checkout> {
  const { cartId, card: cardFields, address: addressFields } = body
  if (!cartId) throw new AppError('cartId is required', 400)

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { lineItems: true },
  })
  if (!cart) throw new NotFoundError('Cart')
  if (cart.lineItems.length === 0) throw new AppError('Cart is empty', 400)

  let customerId = cart.customerId
  if (!customerId) {
    const guest = await prisma.customer.create({
      data: {
        firstName: addressFields.firstName,
        lastName: addressFields.lastName,
        email: `guest_${Date.now()}@noemail.local`,
        passwordHash: '',
      },
    })
    customerId = guest.id
    await prisma.cart.update({ where: { id: cartId }, data: { customerId } })
  }

  const savedAddress = await addAddress(customerId, addressFields)
  const savedCard = await addCard(customerId, cardFields)

  const checkout = await prisma.checkout.upsert({
    where: { cartId },
    create: {
      cartId,
      addressId: savedAddress.id,
      cardId: savedCard.id,
      hasShipping: true,
      hasPayment: true,
    },
    update: {
      addressId: savedAddress.id,
      cardId: savedCard.id,
      hasShipping: true,
      hasPayment: true,
    },
    include: checkoutInclude,
  })

  await prisma.order.create({
    data: {
      checkoutId: checkout.id,
      customerId,
      totalPrice: cart.totalPrice,
      status: 'PENDING',
    },
  })

  return mapCheckout(checkout)
}



