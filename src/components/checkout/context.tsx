'use client'

import { create } from 'zustand'
import type { AddressFields } from '../../types/address'
import type { CardFields } from '../../types/card'


interface CheckoutStore {
  cardFields: Partial<CardFields>
  addressFields: Partial<AddressFields>

  setCardFields: (card: Partial<CardFields>) => void
  setAddressFields: (address: Partial<AddressFields>) => void
  clearCheckoutFields: () => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  cardFields: {},
  addressFields: {},

  setCardFields(card) {
    set((state) => ({
      cardFields: {
        ...state.cardFields,
        ...card,
      },
    }))
  },

  setAddressFields(address) {
    set((state) => ({
      addressFields: {
        ...state.addressFields,
        ...address,
      },
    }))
  },

  clearCheckoutFields() {
    set({
      cardFields: {},
      addressFields: {},
    })
  },
}))