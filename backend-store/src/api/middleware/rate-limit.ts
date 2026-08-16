// src/api/middleware/rate-limit.ts
// حماية من الطلبات الكثيرة — بدون packages إضافية

import { Request, Response, NextFunction } from 'express'
import logger from '../../lib/logger'

interface RateLimitStore {
  count: number
  resetAt: number
}

// خزّن الطلبات في الذاكرة — key: IP, value: { count, resetAt }
const store = new Map<string, RateLimitStore>()

// نظّف الـ store كل دقيقة من الـ IPs المنتهية
setInterval(() => {
  const now = Date.now()
  store.forEach((value, key) => {
    if (now > value.resetAt) store.delete(key)
  })
}, 60_000)

interface RateLimitOptions {
  // عدد الطلبات المسموحة
  max: number
  // المدة الزمنية بالميلي ثانية
  windowMs: number
  // رسالة الخطأ
  message?: string
}

export function rateLimit(options: RateLimitOptions) {
  const { max, windowMs, message = 'Too many requests, please try again later' } = options

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? 'unknown'
    const now = Date.now()

    const record = store.get(key)

    // إذا ما في record أو انتهت المدة → ابدأ من جديد
    if (!record || now > record.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }

    // زد العداد
    record.count++

    // إذا تجاوز الحد → ارفض
    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000)

      logger.warn('Rate limit exceeded', {
        ip:         key,
        path:       req.path,
        count:      record.count,
        retryAfter: `${retryAfter}s`,
      })

      res.setHeader('Retry-After', retryAfter)
      return res.status(429).json({
        data: null,
        errors: [{
          message,
          code: 'rate_limit_exceeded',
        }],
      })
    }

    next()
  }
}

// ─── limiters جاهزة للاستخدام ─────────────────────────────────────────────

// عام — كل الـ routes
export const globalLimiter = rateLimit({
  max:       100,
  windowMs:  60_000, // دقيقة
  message:   'Too many requests, please try again after 1 minute',
})

// login و signup — أكثر تشديداً
export const authLimiter = rateLimit({
  max:       6,
  windowMs:  15 * 60_000, // 15 دقيقة
  message:   'Too many attempts, please try again after 15 minutes',
})

// products — متوسط
export const productsLimiter = rateLimit({
  max:       60,
  windowMs:  60_000, // دقيقة
  message:   'Too many requests, please try again after 1 minute',
})