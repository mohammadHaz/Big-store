import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRY = (process.env.JWT_EXPIRY ?? '7d') as jwt.SignOptions['expiresIn']
const REFRESH_SECRET = process.env.REFRESH_SECRET!

// =========================
// 🔐 ACCESS TOKEN
// =========================

export function signAccessToken(payload: {
  userId: string
  role: 'admin' | 'user'
}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    userId: string
    role: 'admin' | 'user'
    iat: number
    exp: number
  }
}

// =========================
// 🔄 REFRESH TOKEN
// =========================

export function signRefreshToken(payload: {
  sessionId: string
  tokenId: string
}) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as {
    sessionId: string
    tokenId: string
    iat: number
    exp: number
  }
}

// =========================
// ⚠️ SAFE DECODE (بدون تحقق)
// =========================

export function decodeToken(token: string) {
  return jwt.decode(token)
}