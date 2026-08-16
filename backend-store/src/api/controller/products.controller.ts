// src/api/endpoints/products.ts

import { RequestHandler} from 'express'
import { searchProductBodySchema } from '../../schemas'
import * as productOps from '../../operations/product'


// GET /api/commerce/products
// Query params: search, categoryId, brandId, sort
export const getProducts : RequestHandler = async (req, res, next) => {
  try {
    const query = searchProductBodySchema.parse({
      search: req.query.search,
      categoryId: req.query.categoryId,
      brandId: req.query.brandId,
      sort: req.query.sort,
    })
    const data = await productOps.searchProducts(query)
    res
      .set('Cache-Control', 'max-age=0, s-maxage=3600, stale-while-revalidate, public')
      .json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

// GET /api/commerce/products/:slug
export const getProductBySlug : RequestHandler = async (req, res, next) => {
  try {
    const data = await productOps.getProduct(req.params.slug as any)
    if (!data) return res.status(404).json({ data: null, errors: [{ message: 'Product not found' }] })
    res.json({ data, errors: null })
  } catch (err) {
    next(err)
  }
}

