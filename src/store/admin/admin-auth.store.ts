import { create } from "zustand"
import * as adminApi from "@lib/admin-api"
import type { Admin, ApiError } from "@lib/admin-api"

interface AdminAuthStore {
  admin: Admin | null
  // true while the initial "am I still logged in" check is in flight
  isInitializing: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  signup: (data: { name: string; email: string; password: string; secretKey: string }) => Promise<void>
  logout: () => Promise<void>
  // There's no GET /api/admin/auth/me endpoint (admin auth is a single
  // httpOnly JWT cookie with no session-introspection route), so "is this
  // browser still logged in" is answered by trying an authenticated call
  // and seeing whether it 401s — /stats is cheap and admin-only pages need
  // it anyway.
  checkSession: () => Promise<boolean>
}

export const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  admin: null,
  isInitializing: false,
  isLoading: false,

  async login(email, password) {
    set({ isLoading: true })
    try {
      const { admin } = await adminApi.adminLogin(email, password)
      set({ admin })
    } finally {
      set({ isLoading: false })
    }
  },

  async signup(data) {
    set({ isLoading: true })
    try {
      const { admin } = await adminApi.adminSignup(data)
      set({ admin })
    } finally {
      set({ isLoading: false })
    }
  },

  async logout() {
    try {
      await adminApi.adminLogout()
    } catch {
      // drop local state regardless
    } finally {
      set({ admin: null })
    }
  },

  async checkSession() {
    set({ isInitializing: true })
    try {
      await adminApi.getStats()
      return true
    } catch {
      set({ admin: null })
      return false
    } finally {
      set({ isInitializing: false })
    }
  },
}))

export type { ApiError }
