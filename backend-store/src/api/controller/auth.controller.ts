// src/api/endpoints/auth.ts

import {  RequestHandler } from 'express'
import { loginBodySchema, signupBodySchema } from '../../schemas'
import * as authOps from '../../operations/auth/auth'
import { createSession, destroySession, rotateSession } from '../../operations/auth/session';
import { logoutAllSessions } from '../../operations/auth/auth';
import { UnauthorizedError } from '../middleware/errors';

const TOKEN_COOKIE = process.env.CUSTOMER_COOKIE ?? 'commerce_token'
const MAX_AGE = 60 * 60 * 24 * 7 * 1000 // 7 days in ms

// POST /api/commerce/login
export const login: RequestHandler = async (req, res, next) => {
  try {
    const body = loginBodySchema.parse(req.body)
    const { customer } = await authOps.login(body.email, body.password)
    
    const session = await createSession({  id: customer.id, role: 'user'})

    res.cookie(TOKEN_COOKIE, session.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
    })

    res.json({ data: { customer, accessToken: session.accessToken , refreshToken: session.refreshToken }, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/commerce/signup
export const signup: RequestHandler = async (req, res, next) => {
  try {
    const body = signupBodySchema.parse(req.body)
    const customer = await authOps.signup(body)
    res.status(201).json({ data: { customer }, errors: null })
  } catch (err) {
    next(err)
  }
}

// GET /api/commerce/logout
export const logout: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[TOKEN_COOKIE]

    if (refreshToken) {
      await destroySession(refreshToken)
    }

    res.clearCookie(TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return res.json({
      data: null,
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

export const logoutAll: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.customerId
    console.log('User ID for logoutAll:', userId) // Debugging line
    if (!userId) {
      throw new UnauthorizedError('User not authenticated')
    }

    await logoutAllSessions(userId)

    res.clearCookie(TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })

    return res.json({data: null, errors: null})
  } catch (err) {
    next(err)
  }
}


export const refresh: RequestHandler = async (req, res, next) => {
  try {
    // =========================
    // 🍪 1. GET REFRESH TOKEN
    // =========================

    const refreshToken = req.cookies?.[TOKEN_COOKIE]

    if (!refreshToken) {
      throw new UnauthorizedError('No refresh token provided')
    }

    // =========================
    // 🔄 2. ROTATE SESSION
    // =========================

    const result = await rotateSession(refreshToken)

    // =========================
    // 🍪 3. SET NEW REFRESH TOKEN
    // =========================

    res.cookie(TOKEN_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
    })

    // =========================
    // 🚀 4. RETURN NEW ACCESS TOKEN
    // =========================

    return res.json({
      data: {
        accessToken: result.accessToken,
      },
      errors: null,
    })
  } catch (err: any) {
     next(err)
  }
}