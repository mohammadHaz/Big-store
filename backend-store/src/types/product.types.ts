// ─── PRODUCT ─────────────────────────────────────────────────────────────────

import { Image } from "./common.types";

export interface ProductPrice {
  value: number
  currencyCode?: string
  retailPrice?: number
}

export interface ProductOptionValues {
  label: string
  hexColors?: string[]
}

export interface ProductOption {
  id: string
  displayName: string
  values: ProductOptionValues[]
}

export interface ProductVariant {
  id: string
  sku?: string
  name?: string
  options: ProductOption[]
  price?: ProductPrice
  retailPrice?: ProductPrice
  availableForSale?: boolean
  requiresShipping?: boolean
  image?: Image
}

export interface Product {
  id: string
  name: string
  description: string
  descriptionHtml?: string
  sku?: string
  slug?: string
  path?: string
  images: Image[]
  variants: ProductVariant[]
  price: ProductPrice
  options: ProductOption[]
  vendor?: string
}

export interface SearchProductsBody {
  search?: string
  categoryId?: string
  brandId?: string
  sort?: string
  locale?: string
}