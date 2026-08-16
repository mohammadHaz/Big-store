// src/api/errors.ts
// كل الـ error classes + normalizers من الكود الأصلي

import { ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'

// ─── ERROR CLASSES ────────────────────────────────────────────────────────────

export class AppError extends Error {
  status: number
  code: string

  constructor(message: string, status = 500, code = 'internal_error') {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'not_found')
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg = 'Unauthorized') {
    super(msg, 401, 'unauthorized')
  }
}

export class ValidationError extends AppError {
  constructor(msg: string) {
    super(msg, 400, 'validation_error')
  }
}

export class ConflictError extends AppError {
  constructor(msg: string) {
    super(msg, 409, 'conflict')
  }
}

export class SchemaValidationError extends AppError {
  constructor(operation: string, issues: string[]) {
    const count = issues.length
    const msg =
      `Schema validation ${count === 1 ? 'error' : 'errors'} at "${operation}" operation:\n` +
      issues.join('\n')
    super(msg, 500, 'SCHEMA_VALIDATION_ERROR')
  }
}

// ─── ZOD HELPERS (من الكود الأصلي) ──────────────────────────────────────────

/**
 * normalizeZodIssues — يحول Zod issues لرسائل واضحة
 * مأخوذ من الكود الأصلي
 */
export const normalizeZodIssues = (issues: ZodError['issues']): string[] =>
  issues.map(({ path, message }) =>
    path.length ? `${message} at "${path.join('.')}" field` : message
  )

/**
 * getOperationError — يحول أي error من operation لـ AppError موحد
 * مأخوذ من الكود الأصلي withOperationCallback
 */
export const getOperationError = (operation: string, error: unknown): Error => {
  if (error instanceof ZodError) {
    return new SchemaValidationError(operation, normalizeZodIssues(error.issues))
  }
  if (error instanceof AppError) return error
  if (error instanceof Error) return error
  return new AppError(`Unknown error in "${operation}"`)
}

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod validation error — input غلط من الـ client
  if (err instanceof ZodError) {
    const errors = normalizeZodIssues(err.issues).map((message) => ({
      message,
      code: 'validation_error',
    }))
    console.error(`[Validation Error] ${req.method} ${req.path}`)
    return res.status(400).json({ data: null, errors })
  }

  // AppError — خطأ متوقع من التطبيق
  if (err instanceof AppError) {
    if (err.status >= 500) {
      console.error(`[App Error] ${err.code}: ${err.message}`)
    }
    return res.status(err.status).json({
      data: null,
      errors: [{ message: err.message, code: err.code }],
    })
  }

  // خطأ غير متوقع
  console.error('[Unhandled Error]', err)
  return res.status(500).json({
    data: null,
    errors: [{ message: 'An unexpected error occurred' }],
  })
}

