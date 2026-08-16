// src/operations/admin/order.ts

import prisma from '../../lib/prisma'
import { NotFoundError, ValidationError } from '../../api/middleware/errors'

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as const
type OrderStatus = typeof ORDER_STATUSES[number]

const orderInclude = {
  customer: { select: { id: true, firstName: true, lastName: true, email: true } },
  checkout: {
    include: {
      cart: {
        include: {
          lineItems: {
            include: {
              product: true,
              variant: { include: { images: true } },
            },
          },
        },
      },
      address: true,
      card: true,
    },
  },
} as const

export async function adminGetOrders(params?: {
  status?: string
  customerId?: string
  skip?: number
  take?: number
}) {
  const { status, customerId, skip = 0, take = 20 } = params ?? {}

  const where: any = {}
  if (status) where.status = status
  if (customerId) where.customerId = customerId

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: orderInclude,
    }),
  ])

  return { orders, total }
}

export async function adminGetOrderById(id: string) {
  const order = await prisma.order.findUnique({ where: { id }, include: orderInclude })
  if (!order) throw new NotFoundError('Order')
  return order
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new ValidationError(`Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}`)
  }

  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Order')

  return prisma.order.update({ where: { id }, data: { status : status as OrderStatus } })
}

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

const customerInclude = {
  addresses: true,
  cards: { select: { id: true, mask: true, provider: true } },
  orders: { select: { id: true, status: true, totalPrice: true, createdAt: true } },
} as const

export async function adminGetCustomers(params?: {
  search?: string
  skip?: number
  take?: number
}) {
  const { search, skip = 0, take = 20 } = params ?? {}

  const where: any = {}
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [total, customers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: customerInclude,
    }),
  ])

  return { customers, total }
}

export async function adminGetCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: customerInclude,
  })
  if (!customer) throw new NotFoundError('Customer')
  return customer
}

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export async function adminGetStats() {
  const [
    totalProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    revenueResult,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { totalPrice: true },
      where: { status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING'] } },
    }),
  ])

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    totalRevenue: revenueResult._sum.totalPrice ?? 0,
  }
}