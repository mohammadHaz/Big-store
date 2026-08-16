import { Router } from "express"
import { optionalAuth } from "../middleware/auth"

import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../controller/wishlist.controller"

const router = Router()


// All wishlist routes use optional authentication
router.use(optionalAuth)


// GET /api/commerce/wishlist
router.get("/", getWishlist)


// POST /api/commerce/wishlist
router.post( "/", addWishlistItem)


// DELETE /api/commerce/wishlist
router.delete( "/", removeWishlistItem)


export default router