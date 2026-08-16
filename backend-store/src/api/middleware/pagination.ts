// src/api/middleware/pagination.ts
// يقرأ page و limit من الـ query ويحسب skip تلقائياً

import { Request, Response, NextFunction } from 'express'

// أضف pagination للـ Request
declare global {
  namespace Express {
    interface Request {
      pagination: {
        page:  number
        limit: number
        skip:  number
      }
    }
  }
}

export function paginate(defaultLimit = 20, maxLimit = 100) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1)
    const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit as string) || defaultLimit))
    const skip  = (page - 1) * limit

    req.pagination = { page, limit, skip }
    next()
  }
}

// Helper — يبني الـ pagination response
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
}