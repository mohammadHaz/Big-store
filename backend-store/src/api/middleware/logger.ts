// src/api/middleware/logger.ts
// يسجّل كل طلب — متى وصل، كم استغرق، شو رجع

import { Request, Response, NextFunction } from 'express'
import logger from '../../lib/logger'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  // لما الـ response يخلص، سجّل النتيجة
  res.on('finish', () => {
    const duration = Date.now() - start
    const level = res.statusCode >= 500 ? 'error'
                : res.statusCode >= 400 ? 'warn'
                : 'info'

    logger[level]('Request completed', {
      method:   req.method,
      path:     req.path,
      status:   res.statusCode,
      duration: `${duration}ms`,
      ip:       req.ip,
    })
  })

  next()
}