// src/api/endpoints/customer.ts

import { RequestHandler, NextFunction} from 'express'
import {
  addAddressBodySchema,
  updateAddressBodySchema,
  deleteAddressBodySchema,
  addCardBodySchema,
  updateCardBodySchema,
  deleteCardBodySchema,
} from '../../schemas'
import * as customerOps from '../../operations/customer'
import * as authOps from '../../operations/auth/auth'


// GET /api/commerce/customer
export const getCustomer: RequestHandler = async (req, res, next) => {
  try {
    const customer = await authOps.getCustomerById(req.customerId!)
    res.json({ data: { customer }, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── ADDRESSES ───────────────────────────────────────────────────────────────

// GET /api/commerce/customer/addresses
export const getAddresses: RequestHandler = async (req, res, next) => {
  try {
    const data = await customerOps.getAddresses(req.customerId!)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/commerce/customer/addresses
export const addAddress: RequestHandler = async (req, res, next) => {
  try {
    const body = addAddressBodySchema.parse(req.body)
    const data = await customerOps.addAddress(req.customerId!, body.item)
    res.status(201).json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/commerce/customer/addresses
export const updateAddress: RequestHandler = async (req, res, next) => {
  try {
    const body = updateAddressBodySchema.parse(req.body)
    const data = await customerOps.updateAddress(req.customerId!, body.itemId, body.item)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/commerce/customer/addresses
export const deleteAddress: RequestHandler = async (req, res, next) => {
  try {
    const body = deleteAddressBodySchema.parse(req.body)
    await customerOps.removeAddress(req.customerId!, body.itemId)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── CARDS ───────────────────────────────────────────────────────────────────

// GET /api/commerce/customer/cards
export const getCards: RequestHandler = async (req, res, next) => {
  try {
    const data = await customerOps.getCards(req.customerId!)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/commerce/customer/cards
export const addCard: RequestHandler = async (req, res, next) => {
  try {
    const body = addCardBodySchema.parse(req.body)
    const data = await customerOps.addCard(req.customerId!, body.item)
    res.status(201).json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/commerce/customer/cards
export const updateCard: RequestHandler = async (req, res, next) => {
  try {
    const body = updateCardBodySchema.parse(req.body)
    const data = await customerOps.updateCard(req.customerId!, body.itemId, body.item)
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/commerce/customer/cards
export const deleteCard: RequestHandler = async (req, res, next) => {
  try {
    const body = deleteCardBodySchema.parse(req.body)
    await customerOps.removeCard(req.customerId!, body.itemId)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

