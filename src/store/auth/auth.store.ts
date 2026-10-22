import { create } from "zustand"
import * as api from "@lib/api"
import { setAccessToken, setOnSessionExpired, type Customer, type ApiError } from "@lib/api"
import { useWishlistStore } from "@store/wishlist/wishlist.store"

interface AuthStore {
  user: Customer | null
  // true while the initial silent-refresh-on-load is in flight
  isInitializing: boolean
  // true while a login/signup call is in flight
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  signup: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<void>
  logout: () => Promise<void>
  // Called once on app start: tries to turn the httpOnly refresh cookie (if
  // any) into a fresh in-memory access token + the current customer.
  // Silently resolves to "guest" on any failure (expired/missing cookie).
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => {
  // If a refresh ever definitively fails (e.g. token reuse detected, expired
  // session), drop the client-side session too instead of leaving stale UI.
  setOnSessionExpired(() => set({ user: null }))

  return {
    user: null,
    // flips to true only while restoreSession() is actually running
    isInitializing: false,
    isLoading: false,

    async login(email, password) {
      set({ isLoading: true })
      try {
        const { customer, accessToken } = await api.login(email, password)
        setAccessToken(accessToken)
        set({ user: customer })
        // Wishlist is scoped by customerId once logged in, not the guest
        // token anymore — refetch so it reflects the account's wishlist.
        useWishlistStore.getState().fetchWishlist()
      } finally {
        set({ isLoading: false })
      }
    },

    async signup(data) {
      set({ isLoading: true })
      try {
        const { customer, accessToken } = await api.signup(data)
        setAccessToken(accessToken)
        set({ user: customer })
        useWishlistStore.getState().fetchWishlist()
      } finally {
        set({ isLoading: false })
      }
    },

    async logout() {
      try {
        await api.logout()
      } catch {
        // Even if the server call fails, drop the local session below.
      } finally {
        setAccessToken(null)
        set({ user: null })
        useWishlistStore.getState().fetchWishlist()
      }
    },

    async restoreSession() {
      set({ isInitializing: true })
      try {
        const { accessToken } = await api.refresh()
        setAccessToken(accessToken)
        const { customer } = await api.getCustomer()
        set({ user: customer })
      } catch {
        setAccessToken(null)
        set({ user: null })
      } finally {
        set({ isInitializing: false })
      }
    },
  }
})

export type { ApiError }
