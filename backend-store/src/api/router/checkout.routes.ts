import { Router } from "express"
import {
  getCheckout,
  submitCheckout,
} from "../controller/checkout.controller"


const router = Router()


// GET /api/commerce/checkout
router.get("/",getCheckout)


// POST /api/commerce/checkout
router.post("/",submitCheckout)


export default router