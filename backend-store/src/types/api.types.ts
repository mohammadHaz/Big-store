// ─── API ─────────────────────────────────────────────────────────────────────

export interface ErrorData {
  message: string
  code?: string
}

export interface APIResponse<Data = any> {
  data?: Data
  errors?: ErrorData[]
  status?: number
  headers?: Record<string, string | number | string[]> | Headers
  redirectTo?: string
}