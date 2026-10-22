import { create } from "zustand"
import * as api from "@lib/api"
import type { Cart, CartItemInput, ApiError } from "@lib/api"

interface CartStore {
  cart: Cart | null
  // true while the initial cart fetch on app start is in flight
  isInitializing: boolean
  // true while an add/update/remove call is in flight
  isLoading: boolean
  // set when the last add/update/remove call failed; cleared on the next attempt
  error: ApiError | null

  fetchCart: () => Promise<void>
  addItem: (item: CartItemInput) => Promise<void>
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  // Called after a successful checkout: the backend drops the cart cookie
  // (that cart is now tied to an order), so local state should follow suit
  // instead of continuing to show the just-ordered items.
  reset: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isInitializing: false,
  isLoading: false,
  error: null,

  async fetchCart() {
    set({ isInitializing: true })
    try {
      const cart = await api.getCart()
      set({ cart })
    } catch {
      set({ cart: null })
    } finally {
      set({ isInitializing: false })
    }
  },

  async addItem(item) {
    set({ isLoading: true, error: null })
    try {
      const cart = await api.addCartItem(item)
      set({ cart })
    } catch (error) {
      set({ error: error as ApiError })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  async updateItemQuantity(itemId, quantity) {
    const { cart } = get()
    const lineItem = cart?.lineItems.find((li) => li.id === itemId)
    if (!cart || !lineItem) return
    set({ isLoading: true, error: null })
    try {
      const updated = await api.updateCartItem(cart.id, itemId, {
        variantId: lineItem.variantId,
        quantity,
      })
      set({ cart: updated })
    } catch (error) {
      // Swallowed here (not rethrown): callers are plain onClick handlers
      // that don't await this, so a rethrow would surface as an unhandled
      // promise rejection. The `error` field lets UI show a message instead.
      set({ error: error as ApiError })
    } finally {
      set({ isLoading: false })
    }
  },

  async removeItem(itemId) {
    const cartId = get().cart?.id
    if (!cartId) return
    set({ isLoading: true, error: null })
    try {
      const cart = await api.removeCartItem(cartId, itemId)
      set({ cart })
    } catch (error) {
      set({ error: error as ApiError })
    } finally {
      set({ isLoading: false })
    }
  },

  reset() {
    set({ cart: null, error: null })
  },
}))

export type { ApiError }
