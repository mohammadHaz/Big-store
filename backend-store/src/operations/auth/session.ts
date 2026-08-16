import { v4 as uuid } from 'uuid'
import {
  setSession,
  getSession,
  deleteSession,
  blacklistToken,
  isBlacklisted,
} from '../../lib/redis'

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../lib/jwt'

// =========================
// 🧠 CREATE SESSION (LOGIN)
// =========================

export async function createSession(user: {
  id: string
  role: 'admin' | 'user'
}) {
  const sessionId = uuid()
  const tokenId = uuid()

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  })

  const refreshToken = signRefreshToken({
    sessionId,
    tokenId,
  })

  await setSession(sessionId, {
    userId: user.id,
    role: user.role,
    tokenId,
  })

  return {
    accessToken,
    refreshToken,
    sessionId,
  }
}

// =========================
// 🔄 ROTATE SESSION (REFRESH)
// =========================

export async function rotateSession(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken)

  // 🚨 1. Blacklist check (optional extra security)
  const blocked = await isBlacklisted(payload.tokenId)
  if (blocked) {
    await deleteSession(payload.sessionId)
    throw new Error('Token reused (blacklisted)')
  }

  // 🧠 2. Get session
  const session = await getSession(payload.sessionId)

  if (!session) {
    throw new Error('Session expired')
  }

  // 🚨 3. REUSE DETECTION (CORE SECURITY)
  if (session.tokenId !== payload.tokenId) {
    // someone used old refresh token
    await deleteSession(payload.sessionId)
    await blacklistToken(payload.tokenId)

    throw new Error('Refresh token reuse detected (possible theft)')
  }

  // 🔄 4. ROTATE tokenId
  const newTokenId = uuid()

  const newAccessToken = signAccessToken({
    userId: session.userId,
    role: session.role,
  })

  const newRefreshToken = signRefreshToken({
    sessionId: payload.sessionId,
    tokenId: newTokenId,
  })

  // 💾 5. Update session in Redis
  await setSession(payload.sessionId, {
    userId: session.userId,
    role: session.role,
    tokenId: newTokenId,
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }
}

// =========================
// 🚪 DESTROY SESSION (LOGOUT)
// =========================

export async function destroySession(refreshToken: string) {
  try {
    const payload = verifyRefreshToken(refreshToken)
    await deleteSession(payload.sessionId)
  } catch {
    // ignore invalid token
  }
}