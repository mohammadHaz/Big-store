// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface LoginBody {
  email: string
  password: string
  redirectTo?: string
}

export interface SignupBody {
  firstName: string
  lastName: string
  email: string
  password: string
}