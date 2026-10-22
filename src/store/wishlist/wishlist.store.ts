import { create } from "zustand"
import * as api from "@lib/api"
import type { Wishlist, ApiError } from "@lib/api"

// Guests get a wishlist too (the backend issues a token for it — see
// getWishlistByToken in wishlist.controller.ts), but unlike the cart there's
// no httpOnly cookie carrying it, so we persist it ourselves.
const TOKEN_KEY = "commerce_wishlist_token"

function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined
  try {
    return localStorage.getItem(TOKEN_KEY) ?? undefined
  } catch {
    return undefined
  }
}

function storeToken(token: string | undefined) {
  if (typeof window === "undefined" || !token) return
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}

interface WishlistStore {
  wishlist: Wishlist | null
  isInitializing: boolean
  isLoading: boolean
  error: ApiError | null

  fetchWishlist: () => Promise<void>
  toggleItem: (item: { variantId: string; productId: string }) => Promise<void>
  isInWishlist: (productId: string) => boolean
  removeItem: (itemId: string) => Promise<void>
  // Called after login/logout so a guest's wishlist can merge/reset correctly.
  reset: () => void
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: null,
  isInitializing: false,
  isLoading: false,
  error: null,

  async fetchWishlist() {
    set({ isInitializing: true })
    try {
      const wishlist = await api.getWishlist(getStoredToken())
      if (wishlist?.token) storeToken(wishlist.token)
      set({ wishlist })
    } catch {
      set({ wishlist: null })
    } finally {
      set({ isInitializing: false })
    }
  },

  isInWishlist(productId) {
    return !!get().wishlist?.items.some((i) => i.productId === productId)
  },

  async toggleItem(item) {
    const { wishlist } = get()
    const existing = wishlist?.items.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    )

    set({ isLoading: true, error: null })
    try {
      if (existing) {
        const updated = await api.removeWishlistItem(existing.id, getStoredToken())
        set({ wishlist: updated })
      } else {
        const updated = await api.addWishlistItem({ ...item, wishlistToken: getStoredToken() })
        if (updated.token) storeToken(updated.token)
        set({ wishlist: updated })
      }
    } catch (error) {
      set({ error: error as ApiError })
    } finally {
      set({ isLoading: false })
    }
  },

  async removeItem(itemId) {
    set({ isLoading: true, error: null })
    try {
      const updated = await api.removeWishlistItem(itemId, getStoredToken())
      set({ wishlist: updated })
    } catch (error) {
      set({ error: error as ApiError })
    } finally {
      set({ isLoading: false })
    }
  },

  reset() {
    set({ wishlist: null })
  },
}))

export type { ApiError }
