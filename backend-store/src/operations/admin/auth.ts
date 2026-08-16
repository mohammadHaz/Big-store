// src/operations/admin/auth.ts

import prisma from '../../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UnauthorizedError, ConflictError } from '../../api/middleware/errors'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRY = (process.env.JWT_EXPIRY ?? '7d') as jwt.SignOptions['expiresIn']
const SALT_ROUNDS = 12

export async function adminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) throw new UnauthorizedError('Invalid email or password')

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) throw new UnauthorizedError('Invalid email or password')

  const token = jwt.sign(
    { sub: admin.id, role: 'admin' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  )

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  }
}

export async function adminSignup(data: {
  name: string
  email: string
  password: string
  secretKey: string
}) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY
  if (!ADMIN_SECRET || data.secretKey !== ADMIN_SECRET) {
    throw new UnauthorizedError('Invalid secret key')
  }

  const existing = await prisma.admin.findUnique({ where: { email: data.email } })
  if (existing) throw new ConflictError('Email already in use')

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS)
  const admin = await prisma.admin.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  })

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
  }
}