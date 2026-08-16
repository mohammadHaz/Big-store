// ─── WISHLIST ────────────────────────────────────────────────────────────────

import { Product } from "./product.types";

export interface WishlistItem {
  id: string
  productId: string
  variantId: string
  product: Product
}

export interface Wishlist {
  id: string
  items: WishlistItem[]
  token?: string
}

export interface WishlistItemBody {
  variantId: string
  productId: string
  wishlistToken?: string
}
