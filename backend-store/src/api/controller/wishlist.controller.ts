// src/api/endpoints/wishlist.ts

import { RequestHandler, NextFunction } from 'express'
import { wishlistItemBodySchema, removeWishlistItemBodySchema } from '../../schemas'
import * as wishlistOps from '../../operations/wishlist'


// GET /api/commerce/wishlist
export const getWishlist : RequestHandler = async (req, res, next) => {
  try {
    if (!req.customerId) {
      return res.json({ data: null, errors: null })
    }
    const data = await wishlistOps.getWishlist(req.customerId)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/commerce/wishlist
export const addWishlistItem : RequestHandler = async (req, res, next) => {
  try {
    const body = wishlistItemBodySchema.parse(req.body)
    const data = await wishlistOps.addWishlistItem(req.customerId, body)
    res.status(201).json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/commerce/wishlist
export const removeWishlistItem : RequestHandler = async (req, res, next) => {
  try {
    const body = removeWishlistItemBodySchema.parse(req.body)

    const wishlist = req.customerId
      ? await wishlistOps.getWishlist(req.customerId)
      : null

    if (!wishlist) {
      return res.status(404).json({ data: null, errors: [{ message: 'Wishlist not found' }] })
    }

    const data = await wishlistOps.removeWishlistItem(wishlist.id, body.itemId)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}
