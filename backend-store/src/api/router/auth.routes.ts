import { Router } from "express"

import {
  login,
  signup,
  logout,
  refresh,
  logoutAll,
} from "../controller/auth.controller"
import { requireAuth } from "../middleware/auth";



const router = Router()



router.post("/login",login)



router.post("/signup",signup)


router.post('/refresh', refresh)


router.get( "/logout", logout)


router.post( "/logoutall", requireAuth,logoutAll)



export default router