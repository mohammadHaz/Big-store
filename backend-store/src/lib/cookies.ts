// src/lib/cookies.ts
// إدارة الـ cookies بشكل مركزي

import { Request, Response } from 'express'

// ─── CONFIG ──────────────────────────────────────────────────────────────────

export const COOKIE_NAMES = {
  cart:     process.env.CART_COOKIE     ?? 'commerce_cart',
  customer: process.env.CUSTOMER_COOKIE ?? 'commerce_token',
} as const

const IS_PROD = process.env.NODE_ENV === 'production'

const BASE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax'  as const,
  secure:   IS_PROD,
  path:     '/',
}

const CART_MAX_AGE     = 60 * 60 * 24 * 30   // 30 days
const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 7    // 7 days

// ─── GETTERS ─────────────────────────────────────────────────────────────────

export const getCartId = (req: Request): string | undefined =>
  req.cookies[COOKIE_NAMES.cart]

export const getCustomerToken = (req: Request): string | undefined =>
  req.cookies[COOKIE_NAMES.customer] ||
  req.headers.authorization?.replace('Bearer ', '')

// ─── SETTERS ─────────────────────────────────────────────────────────────────

export const setCartCookie = (res: Response, cartId: string): void => {
  res.cookie(COOKIE_NAMES.cart, cartId, {
    ...BASE_OPTIONS,
    maxAge: CART_MAX_AGE * 1000,
  })
}

export const setCustomerCookie = (res: Response, token: string): void => {
  res.cookie(COOKIE_NAMES.customer, token, {
    ...BASE_OPTIONS,
    maxAge: CUSTOMER_MAX_AGE * 1000,
  })
}

// ─── CLEARERS ────────────────────────────────────────────────────────────────

export const clearCartCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAMES.cart, { path: '/' })
}

export const clearCustomerCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAMES.customer, { path: '/' })
}