// src/api/endpoints/cart.ts

import { RequestHandler  } from 'express'
import {
  addItemBodySchema,
  updateItemBodySchema,
  removeItemBodySchema,
} from '../../schemas'
import * as cartOps from '../../operations/cart'

const CART_COOKIE = process.env.CART_COOKIE ?? 'commerce_cart'

// GET /api/commerce/cart
export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const cartId = req.cookies[CART_COOKIE]
    const data = await cartOps.getCart(cartId)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/commerce/cart
export const addItem: RequestHandler = async (req, res, next) => {
  try {
    const cartId = req.cookies[CART_COOKIE]
    const body = addItemBodySchema.parse({ ...req.body, cartId })
    if (!body.item.quantity) body.item.quantity = 1

    const data = await cartOps.addItem(body.cartId, body.item)

    // Set cart cookie if new cart was created
    if (!cartId) {
      res.cookie(CART_COOKIE, data.id, { httpOnly: true, sameSite: 'lax' })
    }

    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/commerce/cart
export const updateItem: RequestHandler = async (req, res, next) => {
  try {
    const cartId = req.cookies[CART_COOKIE]
    const body = updateItemBodySchema.parse({ ...req.body, cartId })
    const data = await cartOps.updateItem(body.cartId, body.itemId, body.item)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/commerce/cart
export const removeItem: RequestHandler = async (req, res, next) => {
  try {
    const cartId = req.cookies[CART_COOKIE]
    const body = removeItemBodySchema.parse({ ...req.body, cartId })
    const data = await cartOps.removeItem(body.cartId, body.itemId)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

