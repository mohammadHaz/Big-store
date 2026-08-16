// src/api/endpoints/admin/product.ts

import { RequestHandler } from 'express'
import {
  adminCreateProductSchema,
  adminUpdateProductSchema,
  adminCreateVariantSchema,
  adminUpdateVariantSchema,
  adminAddImageSchema,
  adminReorderImagesSchema,
  adminAddOptionSchema,
  adminUpdateOptionSchema,
  adminPaginationSchema,
} from '../../../schemas/admin.schemas'
import * as productOps from '../../../operations/admin/product'

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

// GET /api/admin/products
export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const query = adminPaginationSchema.parse(req.query)
    const skip = (query.page - 1) * query.limit

    const { products, total } = await productOps.adminGetProducts({
      search: query.search,
      categoryId: query.categoryId,
      brandId: query.brandId,
      skip,
      take: query.limit,
    })

    res.json({
      data: { products, total, page: query.page, limit: query.limit },
      errors: null,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/products/:id
export const getProductById: RequestHandler = async (req, res, next) => {
  try {
    const product = await productOps.adminGetProductById(req.params.id as string)
    res.json({ data: { product }, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/products
export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const body = adminCreateProductSchema.parse(req.body)
    const product = await productOps.adminCreateProduct(body)
    res.status(201).json({ data: { product }, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/products/:id
export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const body = adminUpdateProductSchema.parse(req.body)
    const product = await productOps.adminUpdateProduct(req.params.id as string, body)
    res.json({ data: { product }, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/products/:id
export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    await productOps.adminDeleteProduct(req.params.id as string)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── IMAGES ──────────────────────────────────────────────────────────────────

// POST /api/admin/products/:id/images
export const addImage: RequestHandler = async (req, res, next) => {
  try {
    const body = adminAddImageSchema.parse(req.body)
    const image = await productOps.adminAddProductImage(req.params.id as string, body)
    res.status(201).json({ data: { image }, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/products/:id/images/:imageId
export const deleteImage: RequestHandler = async (req, res, next) => {
  try {
    await productOps.adminDeleteProductImage(req.params.id as string, req.params.imageId as string)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/products/:id/images/reorder
export const reorderImages: RequestHandler = async (req, res, next) => {
  try {
    const body = adminReorderImagesSchema.parse(req.body)
    const images = await productOps.adminReorderProductImages(req.params.id as string, body.orderedIds)
    res.json({ data: { images }, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── OPTIONS ─────────────────────────────────────────────────────────────────

// POST /api/admin/products/:id/options
export const addOption: RequestHandler = async (req, res, next) => {
  try {
    const body = adminAddOptionSchema.parse(req.body)
    const option = await productOps.adminAddProductOption(req.params.id as string, body)
    res.status(201).json({ data: { option }, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/products/:id/options/:optionId
export const updateOption: RequestHandler = async (req, res, next) => {
  try {
    const body = adminUpdateOptionSchema.parse(req.body)
    const option = await productOps.adminUpdateProductOption(req.params.id as string, req.params.optionId as string, body)
    res.json({ data: { option }, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/products/:id/options/:optionId
export const deleteOption: RequestHandler = async (req, res, next) => {
  try {
    await productOps.adminDeleteProductOption(req.params.id as string, req.params.optionId as string)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}

// ─── VARIANTS ────────────────────────────────────────────────────────────────

// GET /api/admin/products/:id/variants
export const getVariants: RequestHandler = async (req, res, next) => {
  try {
    const variants = await productOps.adminGetVariants(req.params.id as string)
    res.json({ data: { variants }, errors: null })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/products/:id/variants
export const createVariant: RequestHandler = async (req, res, next) => {
  try {
    const body = adminCreateVariantSchema.parse(req.body)
    const variant = await productOps.adminCreateVariant(req.params.id as string, body)
    res.status(201).json({ data: { variant }, errors: null })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/products/:id/variants/:variantId
export const updateVariant: RequestHandler = async (req, res, next) => {
  try {
    const body = adminUpdateVariantSchema.parse(req.body)
    const variant = await productOps.adminUpdateVariant(req.params.id as string, req.params.variantId as string, body)
    res.json({ data: { variant }, errors: null })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/products/:id/variants/:variantId
export const deleteVariant: RequestHandler = async (req, res, next) => {
  try {
    await productOps.adminDeleteVariant(req.params.id as string, req.params.variantId as string)
    res.json({ data: null, errors: null })
  } catch (err) {
    next(err)
  }
}