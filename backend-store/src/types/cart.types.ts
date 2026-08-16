
// ─── CART ────────────────────────────────────────────────────────────────────

import { Discount, Image, Measurement } from "./common.types";

export interface SelectedOption {
  id?: string
  name: string
  value: string
}

export interface CartProductVariant {
  id: string
  sku?: string
  name: string
  price: number
  listPrice: number
  availableForSale?: boolean
  requiresShipping?: boolean
  image?: Image
  weight?: Measurement
  height?: Measurement
  width?: Measurement
  depth?: Measurement
}

export interface LineItem {
  id: string
  variantId: string
  productId: string
  name: string
  quantity: number
  discounts: Discount[]
  path: string
  variant: CartProductVariant
  options?: SelectedOption[]
}

export interface Cart {
  id: string
  customerId?: string
  url?: string
  email?: string
  createdAt: string
  currency: { code: string }
  taxesIncluded: boolean
  lineItems: LineItem[]
  lineItemsSubtotalPrice: number
  subtotalPrice: number
  totalPrice: number
  discounts?: Discount[]
}

export interface CartItemBody {
  variantId: string
  productId?: string
  quantity?: number
  optionsSelected?: SelectedOption[]
}