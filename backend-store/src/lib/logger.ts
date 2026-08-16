// src/lib/logger.ts

import { ZodError } from 'zod'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

function log(level: LogLevel, message: string, meta: Record<string, any> = {}) {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  }

  const output = JSON.stringify(entry)

  if (level === 'error')      console.error(output)
  else if (level === 'warn')  console.warn(output)
  else                        console.log(output)
}

export const logger = {
  info:  (message: string, meta?: Record<string, any>) => log('info',  message, meta),
  warn:  (message: string, meta?: Record<string, any>) => log('warn',  message, meta),
  error: (message: string, meta?: Record<string, any>) => log('error', message, meta),
  debug: (message: string, meta?: Record<string, any>) => log('debug', message, meta),
}

// من الكود الأصلي
export const normalizeZodIssues = (issues: ZodError['issues']): string[] =>
  issues.map(({ path, message }) =>
    path.length ? `${message} at "${path.join('.')}" field` : message
  )

export default logger