// src/api/middleware/auth.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'
import { UnauthorizedError } from './errors'

const TOKEN_COOKIE = process.env.CUSTOMER_COOKIE ?? 'commerce_token'
const JWT_SECRET = process.env.JWT_SECRET!

// Extend Express Request to carry customer
declare global {
  namespace Express {
    interface Request {
      customerId?: string
    }
  }
}

export  const requireAuth: RequestHandler = async (req , res , next ) => {
  try {
    const token =
      req.headers.authorization?.replace('Bearer ', '')

    if (!token) throw new UnauthorizedError()

    const payload = jwt.verify(token, JWT_SECRET) as { 
  userId: string
  role: 'admin' | 'user'
  }
    const customer = await prisma.customer.findUnique({
      where: { id: payload.userId },
      select: { id: true },
    })

    if (!customer) throw new UnauthorizedError()

    req.customerId = customer.id
    next()
  } catch {
    next(new UnauthorizedError())
  }
}
export const requireAdmin: RequestHandler = (req, res, next) => {
  const user = (req as any).user

  if (!user) {
    throw new UnauthorizedError('User not authenticated')
  }

  if (user.role !== 'admin') {
    throw new UnauthorizedError('Forbidden (Admin only)')
  }

  next()
}

export  const optionalAuth: RequestHandler = (req, res, next) => {
  try {
    const token =
      req.cookies?.[TOKEN_COOKIE] ||
      req.headers.authorization?.replace('Bearer ', '')

    if (token) {
      const payload = jwt.verify(token, JWT_SECRET) as { sub: string }
      req.customerId = payload.sub
    }
  } catch {
    // No auth — continue as guest
  }
  next()
}