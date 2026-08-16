

// src/operations/auth.ts

import prisma from '../../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UnauthorizedError, ConflictError } from '../../api/middleware/errors'
import { Customer } from '../../types'
import { signAccessToken } from '../../lib/jwt'
import redis from '../../lib/redis';
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRY = (process.env.JWT_EXPIRY ?? '7d') as jwt.SignOptions['expiresIn']
const SALT_ROUNDS = 12

function mapCustomer(raw: any): Customer {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone ?? undefined,
    company: raw.company ?? undefined,
    notes: raw.notes ?? undefined,
    acceptsMarketing: raw.acceptsMarketing,
  }
}

export async function login(email: string, password: string) {
  const customer = await prisma.customer.findUnique({ where: { email } })
  if (!customer) throw new UnauthorizedError('Invalid email or password')

  const valid = await bcrypt.compare(password, customer.passwordHash)
  if (!valid) throw new UnauthorizedError('Invalid  password')

  // await signAccessToken({ userId: customer.id, role: 'user' })

  return { customer: mapCustomer(customer) }
}

export async function signup(data: {
  firstName: string
  lastName: string
  email: string
  password: string
}) {
  const existing = await prisma.customer.findUnique({ where: { email: data.email } })
  if (existing) throw new ConflictError('Email already in use')

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)
  const customer = await prisma.customer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
    },
  })

  return mapCustomer(customer)
}

export async function getCustomerById(id: string) {
  const raw = await prisma.customer.findUnique({ where: { id } })
  return raw ? mapCustomer(raw) : null
}

// =========================
// 🔐 Logout All Session
// =========================
export async function logoutAllSessions(userId: string) {
  const keys = await redis.keys('session:*')

  for (const key of keys) {
    const session = await redis.get(key)
    if (!session) continue

    const data = JSON.parse(session)

    if (data.userId === userId) {
      await redis.del(key)
    }
  }
}