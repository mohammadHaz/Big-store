import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
})
redis.on('connect', () => {
  console.log('✅ Redis connected')
})

redis.on('ready', () => {
  console.log('✅ Redis ready')
})

redis.on('error', (error) => {
  console.error('❌ Redis error:', error.message)
})

// =========================
// 🧠 SESSION HELPERS
// =========================

export async function setSession(
  sessionId: string,
  data: {
    userId: string
    role: 'admin' | 'user'
    tokenId: string
  },
  ttlSeconds = 60 * 60 * 24 * 7 // 7 days
) {
  await redis.set(
    `session:${sessionId}`,
    JSON.stringify(data),
    'EX',
    ttlSeconds
  )
}

export async function getSession(sessionId: string) {
  const data = await redis.get(`session:${sessionId}`)
  if (!data) return null
  return JSON.parse(data) as {
    userId: string
    role: 'admin' | 'user'
    tokenId: string
  }
}

export async function deleteSession(sessionId: string) {
  await redis.del(`session:${sessionId}`)
}

// =========================
// 🔐 TOKEN BLACKLIST (optional but powerful)
// =========================

export async function blacklistToken(tokenId: string, ttlSeconds = 60 * 60 * 24 * 7) {
  await redis.set(`blacklist:${tokenId}`, '1', 'EX', ttlSeconds)
}

export async function isBlacklisted(tokenId: string) {
  const res = await redis.get(`blacklist:${tokenId}`)
  return res === '1'
}

export default redis