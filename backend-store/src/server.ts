// src/server.ts

import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { requestLogger } from './api/middleware/logger'

import { globalLimiter, authLimiter } from './api/middleware/rate-limit'
import { errorHandler } from './api/middleware/errors'
import authRouter    from './api/router/auth.routes'
import cardRouter    from './api/router/card.routes'
import productsRouter from './api/router/products.routes'
import customerRouter from './api/router/customer.routes'
import checkoutRouter from './api/router/checkout.routes'
import wishlistRouter from './api/router/wishlist.routes'
import adminRouter    from './api/router/admin.routes'
const app = express()
const PORT = process.env.PORT ?? 3000

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3001', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(requestLogger)   // سجّل كل طلب
// app.use(globalLimiter)   // حد عام لكل الـ routes
// ─── ROUTES ───────────────────────────────────────────────────────────────────

app.use('/api/commerce',  authLimiter, authRouter)
app.use('/api/commerce/card',     cardRouter)
app.use('/api/commerce/products', productsRouter)
app.use('/api/commerce/customer', customerRouter)
app.use('/api/commerce/checkout', checkoutRouter)
app.use('/api/commerce/wishlist', wishlistRouter)
app.use('/api/admin',             adminRouter) 

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// 404
app.use((_req, res) => {
  res.status(404).json({ data: null, errors: [{ message: 'Route not found', code: 'not_found' }] })
})

// ─── ERROR HANDLER — لازم يكون آخر شي ──────────────────────────────────────

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`)
  console.log(`📦 API:    http://localhost:${PORT}/api/commerce`)
})

export default app