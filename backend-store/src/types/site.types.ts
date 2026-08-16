// ─── SITE ────────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  slug: string
  path: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  path: string
}

export interface Page {
  id: string
  name: string
  url?: string
  body: string
  is_visible?: boolean
  sort_order?: number
}