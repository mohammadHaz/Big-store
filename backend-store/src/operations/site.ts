// src/operations/site.ts

import type { Category, Brand, Page } from '../types'
import { prisma } from '../lib/prisma'
import { NotFoundError } from '../api/middleware/errors'

export async function getSiteInfo(): Promise<{
  categories: Category[]
  brands: Brand[]
}> {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  return { categories, brands }
}

export async function getAllPages(): Promise<{ pages: Page[] }> {
  const rows = await prisma.page.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: 'asc' },
  })

  return {
    pages: rows.map((p ) => ({
      id: p.id,
      name: p.name,
      url: p.url ?? undefined,
      body: p.body,
      is_visible: p.isVisible,
      sort_order: p.sortOrder,
    })),
  }
}

export async function getPage(id: string): Promise<{ page?: Page }> {
  const row = await prisma.page.findUnique({ where: { id } })

  if (!row) return { page: undefined }

  return {
    page: {
      id: row.id,
      name: row.name,
      url: row.url ?? undefined,
      body: row.body,
      is_visible: row.isVisible,
      sort_order: row.sortOrder,
    },
  }
}