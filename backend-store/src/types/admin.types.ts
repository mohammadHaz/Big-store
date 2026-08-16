// src/types/admin.types.ts

// ─── PRODUCT ─────────────────────────────────────────────────────────────────

export interface AdminImageBody {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface AdminOptionValueBody {
  label: string
  hexColors?: string[]
}

export interface AdminOptionBody {
  displayName: string
  values: AdminOptionValueBody[]
}

export interface AdminPriceBody {
  value: number
  currencyCode?: string
  retailPrice?: number
}

export interface AdminCreateProductBody {
  name: string
  description: string
  descriptionHtml?: string
  sku?: string
  slug?: string
  path?: string
  vendor?: string
  categoryId?: string
  brandId?: string
  price?: AdminPriceBody
  images?: AdminImageBody[]
  options?: AdminOptionBody[]
}

export interface AdminUpdateProductBody {
  name?: string
  description?: string
  descriptionHtml?: string
  sku?: string
  slug?: string
  path?: string
  vendor?: string
  categoryId?: string
  brandId?: string
  price?: AdminPriceBody
}

// ─── VARIANT ─────────────────────────────────────────────────────────────────

export interface AdminCreateVariantBody {
  sku?: string
  name?: string
  price?: number
  retailPrice?: number
  currencyCode?: string
  availableForSale?: boolean
  requiresShipping?: boolean
  weight?: number
  weightUnit?: string
  images?: AdminImageBody[]
  options?: { name: string; value: string }[]
}

export interface AdminUpdateVariantBody {
  sku?: string
  name?: string
  price?: number
  retailPrice?: number
  currencyCode?: string
  availableForSale?: boolean
  requiresShipping?: boolean
  weight?: number
  weightUnit?: string
}