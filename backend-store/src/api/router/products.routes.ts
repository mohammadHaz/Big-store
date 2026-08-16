import { Router } from "express"

import {
  getProducts,
  getProductBySlug,
} from "../controller/products.controller"

const router = Router()


// GET /api/commerce/products
// Query Params:
// - search
// - categoryId
// - brandId
// - sort
router.get("/" , getProducts)


// GET /api/commerce/products/:slug
router.get("/:slug", getProductBySlug)


export default router