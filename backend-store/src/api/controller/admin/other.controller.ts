// src/api/endpoints/admin/other.ts

import { RequestHandler } from 'express'
import {
  adminLoginSchema,
  adminSignupSchema,
  adminCreateCategorySchema,
  adminUpdateCategorySchema,
  adminCreateBrandSchema,
  adminUpdateBrandSchema,
  adminCreatePageSchema,
  adminUpdatePageSchema,
  adminUpdateOrderStatusSchema,
  adminPaginationSchema,
} from '../../../schemas/admin.schemas'
import * as authOps from '../../../operations/admin/auth'
import * as siteOps from '../../../operations/admin/site'
import * as orderOps from '../../../operations/admin/order'

const ADMIN_COOKIE = process.env.ADMIN_COOKIE ?? 'admin_token'
const MAX_AGE = 60 * 60 * 24 * 7 * 1000 // 7 days

// ─── AUTH ────────────────────────────────────────────────────────────────────

// POST /api/admin/auth/login
export const login: RequestHandler = async (req, res, next) => {
  try {
    const body = adminLoginSchema.parse(req.body)
    const { token, admin } = await authOps.adminLogin(body.email, body.password)

    res.cookie(ADMIN_COOKIE, token, { httpOnly: true, sameSite: 'lax', maxAge: MAX_AGE })
    res.json({ data: { admin }, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/auth/signup
export const signup: RequestHandler = async (req, res, next) => {
  try {
    const body = adminSignupSchema.parse(req.body)
    const admin = await authOps.adminSignup(body)
    res.status(201).json({ data: { admin }, errors: null })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/auth/logout
export const logout: RequestHandler = (req, res) => {
  res.clearCookie(ADMIN_COOKIE)
  res.json({ data: null, errors: null })
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

// GET /api/admin/stats
export const getStats: RequestHandler = async (req, res, next) => {
  try {
    const stats = await orderOps.adminGetStats()
    res.json({ data: stats, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

// GET /api/admin/categories
export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await siteOps.adminGetCategories()
    res.json({ data: { categories }, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/categories
export const createCategory: RequestHandler = async (req, res, next) => {
  try {
    const body = adminCreateCategorySchema.parse(req.body)
    const category = await siteOps.adminCreateCategory(body)
    res.status(201).json({ data: { category }, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/categories/:id
export const updateCategory: RequestHandler = async (req, res, next) => {
  try {
    const body = adminUpdateCategorySchema.parse(req.body)
    const category = await siteOps.adminUpdateCategory(req.params.id as string, body)
    res.json({ data: { category }, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/categories/:id
export const deleteCategory: RequestHandler = async (req, res, next) => {
  try {
    await siteOps.adminDeleteCategory(req.params.id as string)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── BRANDS ──────────────────────────────────────────────────────────────────

// GET /api/admin/brands
export const getBrands: RequestHandler = async (req, res, next) => {
  try {
    const brands = await siteOps.adminGetBrands()
    res.json({ data: { brands }, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/brands
export const createBrand: RequestHandler = async (req, res, next) => {
  try {
    const body = adminCreateBrandSchema.parse(req.body)
    const brand = await siteOps.adminCreateBrand(body)
    res.status(201).json({ data: { brand }, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/brands/:id
export const updateBrand: RequestHandler = async (req, res, next) => {
  try {
    const body = adminUpdateBrandSchema.parse(req.body)
    const brand = await siteOps.adminUpdateBrand(req.params.id as string, body)
    res.json({ data: { brand }, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/brands/:id
export const deleteBrand: RequestHandler = async (req, res, next) => {
  try {
    await siteOps.adminDeleteBrand(req.params.id as string)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

// GET /api/admin/pages
export const getPages: RequestHandler = async (req, res, next) => {
  try {
    const pages = await siteOps.adminGetPages()
    res.json({ data: { pages }, errors: null })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/pages/:id
export const getPageById: RequestHandler = async (req, res, next) => {
  try {
    const page = await siteOps.adminGetPageById(req.params.id as string)
    res.json({ data: { page }, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/pages
export const createPage: RequestHandler = async (req, res, next) => {
  try {
    const body = adminCreatePageSchema.parse(req.body)
    const page = await siteOps.adminCreatePage(body)
    res.status(201).json({ data: { page }, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/pages/:id
export const updatePage: RequestHandler = async (req, res, next) => {
  try {
    const body = adminUpdatePageSchema.parse(req.body)
    const page = await siteOps.adminUpdatePage(req.params.id as string, body)
    res.json({ data: { page }, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/pages/:id
export const deletePage: RequestHandler = async (req, res, next) => {
  try {
    await siteOps.adminDeletePage(req.params.id as string)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

// GET /api/admin/orders
export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    const query = adminPaginationSchema.parse(req.query)
    const skip = (query.page - 1) * query.limit

    const { orders, total } = await orderOps.adminGetOrders({
      status: query.status,
      customerId: query.customerId,
      skip,
      take: query.limit,
    })

    res.json({ data: { orders, total, page: query.page, limit: query.limit }, errors: null })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/orders/:id
export const getOrderById: RequestHandler = async (req, res, next) => {
  try {
    const order = await orderOps.adminGetOrderById(req.params.id as string)
    res.json({ data: { order }, errors: null })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus: RequestHandler = async (req, res, next) => {
  try {
    const body = adminUpdateOrderStatusSchema.parse(req.body)
    const order = await orderOps.adminUpdateOrderStatus(req.params.id as string, body.status)
    res.json({ data: { order }, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

// GET /api/admin/customers
export const getCustomers: RequestHandler = async (req, res, next) => {
  try {
    const query = adminPaginationSchema.parse(req.query)
    const skip = (query.page - 1) * query.limit

    const { customers, total } = await orderOps.adminGetCustomers({
      search: query.search,
      skip,
      take: query.limit,
    })

    res.json({ data: { customers, total, page: query.page, limit: query.limit }, errors: null })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/customers/:id
export const getCustomerById: RequestHandler = async (req, res, next) => {
  try {
    const customer = await orderOps.adminGetCustomerById(req.params.id as string)
    res.json({ data: { customer }, errors: null })
  } catch (err) {
    next(err)
  }
}