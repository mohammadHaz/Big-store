// src/api/middleware/admin.auth.ts

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'
import { UnauthorizedError } from './errors'

const TOKEN_COOKIE = process.env.ADMIN_COOKIE ?? 'admin_token'
const JWT_SECRET = process.env.JWT_SECRET!

declare global {
  namespace Express {
    interface Request {
      adminId?: string
    }
  }
}

export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies?.[TOKEN_COOKIE] ||
      req.headers.authorization?.replace('Bearer ', '')

    if (!token) throw new UnauthorizedError()

    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; role: string }

    if (payload.role !== 'admin') throw new UnauthorizedError('Admin access required')

    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    })

    if (!admin) throw new UnauthorizedError()

    req.adminId = admin.id
    next()
  } catch {
    next(new UnauthorizedError())
  }
}