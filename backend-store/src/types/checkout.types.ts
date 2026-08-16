// ─── CHECKOUT ────────────────────────────────────────────────────────────────

import { LineItem } from "./cart.types";
import { AddressFields, Card, CardFields } from "./customer.types";

export interface Checkout {
  hasPayment: boolean
  hasShipping: boolean
  addressId: string
  payments?: Card[]
  cardId?: string
  lineItems?: LineItem[]
}

export interface CheckoutBody {
  cartId?: string
  card: CardFields
  address: AddressFields
}