import { create } from "zustand"
import * as api from "@lib/api"
import type { AddressFields, CardFields, Checkout, ApiError } from "@lib/api"
import { useCartStore } from "@store/cart/cart.store"

interface CheckoutStore {
  addressFields: Partial<AddressFields>
  cardFields: Partial<CardFields>
  isLoading: boolean
  error: ApiError | null
  result: Checkout | null

  setAddressFields: (address: Partial<AddressFields>) => void
  setCardFields: (card: Partial<CardFields>) => void
  clearCheckoutFields: () => void
  submit: (cartId: string) => Promise<Checkout>
}

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
  addressFields: {},
  cardFields: {},
  isLoading: false,
  error: null,
  result: null,

  setAddressFields(address) {
    set((state) => ({ addressFields: { ...state.addressFields, ...address } }))
  },

  setCardFields(card) {
    set((state) => ({ cardFields: { ...state.cardFields, ...card } }))
  },

  clearCheckoutFields() {
    set({ addressFields: {}, cardFields: {}, result: null, error: null })
  },

  async submit(cartId) {
    const { addressFields, cardFields } = get()
    set({ isLoading: true, error: null })
    try {
      const result = await api.submitCheckout({
        cartId,
        address: addressFields as AddressFields,
        card: cardFields as CardFields,
      })
      set({ result })
      // The backend clears the cart cookie once an order is created — drop
      // the local cart state to match, instead of still showing the items
      // that were just ordered.
      useCartStore.getState().reset()
      return result
    } catch (error) {
      set({ error: error as ApiError })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))

export type { ApiError }
