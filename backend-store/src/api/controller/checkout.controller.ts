// src/api/endpoints/checkout.ts

import { RequestHandler} from 'express'
import { submitCheckoutBodySchema } from '../../schemas'
import * as checkoutOps from '../../operations/checkout'

const CART_COOKIE = process.env.CART_COOKIE ?? 'commerce_cart'

// GET /api/commerce/checkout
export const getCheckout: RequestHandler = async (req, res, next) => {
  try {
    const cartId = req.cookies[CART_COOKIE]
    const data = await checkoutOps.getCheckout(cartId)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/commerce/checkout
export const submitCheckout: RequestHandler = async (req, res, next) => {
  try {
    const cartId = req.cookies[CART_COOKIE]
    const body = submitCheckoutBodySchema.parse({ ...req.body, cartId })
    const data = await checkoutOps.submitCheckout(body)
    res.status(201).json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

