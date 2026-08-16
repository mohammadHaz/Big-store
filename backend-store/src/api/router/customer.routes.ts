import { Router } from "express"
import { requireAuth } from "../middleware/auth"

import {
  getCustomer,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getCards,
  addCard,
  updateCard,
  deleteCard,
} from "../controller/customer.controller"


const router = Router()


// All customer routes require auth
router.use(requireAuth)


// GET /api/commerce/customer
router.get("/",getCustomer)


// ─── ADDRESSES ───────────────────────────────────────────────


// GET /api/commerce/customer/addresses
router.get("/addresses",getAddresses)


// POST /api/commerce/customer/addresses
router.post("/addresses",addAddress)


// PUT /api/commerce/customer/addresses
router.put("/addresses",updateAddress)


// DELETE /api/commerce/customer/addresses
router.delete("/addresses",deleteAddress)


// ─── CARDS ───────────────────────────────────────────────────


// GET /api/commerce/customer/cards
router.get("/cards",getCards)


// POST /api/commerce/customer/cards
router.post("/cards",addCard)


// PUT /api/commerce/customer/cards
router.put("/cards",updateCard)


// DELETE /api/commerce/customer/cards
router.delete("/cards",deleteCard)


export default router