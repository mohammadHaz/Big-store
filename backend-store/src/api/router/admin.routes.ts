// src/api/router/admin.routes.ts

import { Router } from 'express'
import { requireAdmin } from '../middleware/admin.auth'
import { authLimiter } from '../middleware/rate-limit'

import {
  login,
  logout,
  signup,
  getStats,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getPages,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getCustomers,
  getCustomerById,
} from '../../api/controller/admin/other.controller'

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addImage,
  deleteImage,
  reorderImages,
  addOption,
  updateOption,
  deleteOption,
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
} from '../../api/controller/admin/product.controller'

const router = Router()

// ─── AUTH (no admin middleware) ───────────────────────────────────────────────

router.post('/auth/login',  authLimiter, login)
router.post('/auth/signup', authLimiter, signup)
router.get('/auth/logout',  logout)

// ─── ALL ROUTES BELOW REQUIRE ADMIN ──────────────────────────────────────────

router.use(requireAdmin)

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

router.get('/stats', getStats)

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

router.get('/products',     getProducts)
router.get('/products/:id', getProductById)
router.post('/products',    createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

// Images
router.post('/products/:id/images',          addImage)
router.delete('/products/:id/images/:imageId', deleteImage)
router.put('/products/:id/images/reorder',   reorderImages)

// Options
router.post('/products/:id/options',                    addOption)
router.put('/products/:id/options/:optionId',           updateOption)
router.delete('/products/:id/options/:optionId',        deleteOption)

// Variants
router.get('/products/:id/variants',                    getVariants)
router.post('/products/:id/variants',                   createVariant)
router.put('/products/:id/variants/:variantId',         updateVariant)
router.delete('/products/:id/variants/:variantId',      deleteVariant)

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

router.get('/categories',      getCategories)
router.post('/categories',     createCategory)
router.put('/categories/:id',  updateCategory)
router.delete('/categories/:id', deleteCategory)

// ─── BRANDS ──────────────────────────────────────────────────────────────────

router.get('/brands',      getBrands)
router.post('/brands',     createBrand)
router.put('/brands/:id',  updateBrand)
router.delete('/brands/:id', deleteBrand)

// ─── PAGES ───────────────────────────────────────────────────────────────────

router.get('/pages',       getPages)
router.get('/pages/:id',   getPageById)
router.post('/pages',      createPage)
router.put('/pages/:id',   updatePage)
router.delete('/pages/:id', deletePage)

// ─── ORDERS ──────────────────────────────────────────────────────────────────

router.get('/orders',              getOrders)
router.get('/orders/:id',          getOrderById)
router.patch('/orders/:id/status', updateOrderStatus)

// ─── CUSTOMERS ───────────────────────────────────────────────────────────────

router.get('/customers',     getCustomers)
router.get('/customers/:id', getCustomerById)

export default router