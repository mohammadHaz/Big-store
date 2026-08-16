import { Router } from "express"
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
} from "../controller/cart.controller"


const router = Router()


// GET /api/commerce/cart
router.get("/", getCart)


// POST /api/commerce/cart
router.post("/", addItem)


// PUT /api/commerce/cart
router.put("/", updateItem)


// DELETE /api/commerce/cart
router.delete("/", removeItem)


export default router