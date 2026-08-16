// src/lib/operation-wrapper.ts
// withOperationCallback من الكود الأصلي — يتحقق من input وoutput لكل operation

import { z, type ZodType } from 'zod'
import { getOperationError } from '../api/middleware/errors'

type OperationName =
  | 'getCart' | 'addItem' | 'updateItem' | 'removeItem'
  | 'getProduct' | 'getAllProducts' | 'getAllProductPaths' | 'searchProducts'
  | 'login' | 'signup' | 'getCustomer'
  | 'getAddresses' | 'addAddress' | 'updateAddress' | 'removeAddress'
  | 'getCards' | 'addCard' | 'updateCard' | 'removeCard'
  | 'getCheckout' | 'submitCheckout'
  | 'getWishlist' | 'addWishlistItem' | 'removeWishlistItem'
  | 'getSiteInfo' | 'getAllPages' | 'getPage'

/**
 * withOperation — يلف أي operation بـ:
 * 1. try/catch موحد
 * 2. تحويل الـ errors لـ AppError
 * 3. Zod validation على الـ output
 */
export function withOperation<T>(
  name: OperationName,
  fn: () => Promise<T>,
  outputSchema?: ZodType<T>
): Promise<T> {
  return fn()
    .then((data) => {
      // تحقق من الـ output إذا في schema
      if (outputSchema && data !== null && data !== undefined) {
        outputSchema.parse(data)
      }
      return data
    })
    .catch((error) => {
      throw getOperationError(name, error)
    })
}

// ─── OUTPUT SCHEMAS ──────────────────────────────────────────────────────────
// نفس الـ schemas المستخدمة في withOperationCallback من الكود الأصلي

import {
  cartSchema,
  productSchema,
  customerSchema,
  addressSchema,
  cardSchema,
  checkoutSchema,
  wishlistSchema,
} from '../schemas'

export const OUTPUT_SCHEMAS = {
  // Cart
  getCart:    cartSchema.nullable(),
  addItem:    cartSchema,
  updateItem: cartSchema,
  removeItem: cartSchema,

  // Product
  getProduct:          productSchema.nullable(),
  getAllProducts:       z.array(productSchema),
  getAllProductPaths:   z.array(z.object({ path: z.string().optional() })),
  searchProducts:      z.object({ products: z.array(productSchema), found: z.boolean() }),

  // Auth
  login:       z.object({ token: z.string(), customer: customerSchema }),
  signup:      customerSchema,
  getCustomer: customerSchema.nullable(),

  // Address
  getAddresses:  z.array(addressSchema),
  addAddress:    addressSchema,
  updateAddress: addressSchema,
  removeAddress: z.null(),

  // Card
  getCards:  z.array(cardSchema),
  addCard:   cardSchema,
  updateCard: cardSchema,
  removeCard: z.null(),

  // Checkout
  getCheckout:     checkoutSchema.nullable(),
  submitCheckout:  checkoutSchema,

  // Wishlist
  getWishlist:       wishlistSchema.nullable(),
  addWishlistItem:   wishlistSchema,
  removeWishlistItem: wishlistSchema,
} as const