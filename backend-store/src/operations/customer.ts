// src/operations/customer.ts

import prisma from '../lib/prisma'
import { Address, AddressFields, Card, CardFields } from '../types'
import { NotFoundError } from '../api/middleware/errors'

// ─── ADDRESSES ───────────────────────────────────────────────────────────────

function mapAddress(raw: any): Address {
  return { id: raw.id, mask: raw.mask }
}

export async function getAddresses(customerId: string): Promise<Address[]> {
  const rows = await prisma.address.findMany({
    where: { customerId },
    orderBy: { createdAt: 'asc' },
  })
  return rows.map(mapAddress)
}

export async function addAddress(customerId: string, item: AddressFields): Promise<Address> {
  const mask = `${item.type} — ${item.city}, ${item.country}`
  const row = await prisma.address.create({
    data: { customerId, mask, ...item },
  })
  return mapAddress(row)
}

export async function updateAddress(
  customerId: string,
  itemId: string,
  item: AddressFields
): Promise<Address> {
  const existing = await prisma.address.findFirst({ where: { id: itemId, customerId } })
  if (!existing) throw new NotFoundError('Address')

  const mask = `${item.type} — ${item.city}, ${item.country}`
  const row = await prisma.address.update({ where: { id: itemId }, data: { mask, ...item } })
  return mapAddress(row)
}

export async function removeAddress(customerId: string, itemId: string): Promise<void> {
  const existing = await prisma.address.findFirst({ where: { id: itemId, customerId } })
  if (!existing) throw new NotFoundError('Address')
  await prisma.address.delete({ where: { id: itemId } })
}

// ─── CARDS ───────────────────────────────────────────────────────────────────

function mapCard(raw: any): Card {
  return { id: raw.id, mask: raw.mask, provider: raw.provider }
}

function detectProvider(cardNumber: string): string {
  if (cardNumber.startsWith('4')) return 'Visa'
  if (/^5[1-5]/.test(cardNumber)) return 'Mastercard'
  if (/^3[47]/.test(cardNumber)) return 'Amex'
  return 'Unknown'
}

export async function getCards(customerId: string): Promise<Card[]> {
  const rows = await prisma.card.findMany({
    where: { customerId },
    orderBy: { createdAt: 'asc' },
  })
  return rows.map(mapCard)
}

export async function addCard(customerId: string, item: CardFields): Promise<Card> {
  const mask = item.cardNumber.slice(-4)
  const provider = detectProvider(item.cardNumber)
  const paymentToken = `tok_${mask}_${Date.now()}`

  const { cardNumber, cardCvc, ...rest } = item
  const row = await prisma.card.create({
    data: { customerId, mask, provider, paymentToken, ...rest },
  })
  return mapCard(row)
}

export async function updateCard(
  customerId: string,
  itemId: string,
  item: CardFields
): Promise<Card> {
  const existing = await prisma.card.findFirst({ where: { id: itemId, customerId } })
  if (!existing) throw new NotFoundError('Card')

  const mask = item.cardNumber.slice(-4)
  const provider = detectProvider(item.cardNumber)
  const paymentToken = `tok_${mask}_${Date.now()}`
  const { cardNumber, cardCvc, ...rest } = item

  const row = await prisma.card.update({
    where: { id: itemId },
    data: { mask, provider, paymentToken, ...rest },
  })
  return mapCard(row)
}

export async function removeCard(customerId: string, itemId: string): Promise<void> {
  const existing = await prisma.card.findFirst({ where: { id: itemId, customerId } })
  if (!existing) throw new NotFoundError('Card')
  await prisma.card.delete({ where: { id: itemId } })
}

