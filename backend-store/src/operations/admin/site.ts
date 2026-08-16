// src/operations/admin/site.ts

import prisma from '../../lib/prisma'
import { NotFoundError, ConflictError } from '../../api/middleware/errors'

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function adminGetCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export async function adminCreateCategory(data: { name: string; slug?: string; path?: string }) {
  const slug = data.slug ?? slugify(data.name)
  const path = data.path ?? `/categories/${slug}`

  const existing = await prisma.category.findFirst({ where: { slug } })
  if (existing) throw new ConflictError('Category slug already exists')

  return prisma.category.create({ data: { name: data.name, slug, path } })
}

export async function adminUpdateCategory(
  id: string,
  data: { name?: string; slug?: string; path?: string }
) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Category')

  const slug = data.slug ?? (data.name ? slugify(data.name) : existing.slug)
  const path = data.path ?? `/${slug}`

  return prisma.category.update({ where: { id }, data: { name: data.name, slug, path } })
}

export async function adminDeleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Category')
  await prisma.category.delete({ where: { id } })
}

// ─── BRANDS ──────────────────────────────────────────────────────────────────

export async function adminGetBrands() {
  return prisma.brand.findMany({ orderBy: { name: 'asc' } })
}

export async function adminCreateBrand(data: { name: string; slug?: string; path?: string }) {
  const slug = data.slug ?? slugify(data.name)
  const path = data.path ?? `/brands/${slug}`

  const existing = await prisma.brand.findFirst({ where: { slug } })
  if (existing) throw new ConflictError('Brand slug already exists')

  return prisma.brand.create({ data: { name: data.name, slug, path } })
}

export async function adminUpdateBrand(
  id: string,
  data: { name?: string; slug?: string; path?: string }
) {
  const existing = await prisma.brand.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Brand')

  const slug = data.slug ?? (data.name ? slugify(data.name) : existing.slug)
  const path = data.path ?? `/${slug}`

  return prisma.brand.update({ where: { id }, data: { name: data.name, slug, path } })
}

export async function adminDeleteBrand(id: string) {
  const existing = await prisma.brand.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Brand')
  await prisma.brand.delete({ where: { id } })
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

export async function adminGetPages() {
  return prisma.page.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function adminGetPageById(id: string) {
  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) throw new NotFoundError('Page')
  return page
}

export async function adminCreatePage(data: {
  name: string
  url?: string
  body: string
  isVisible?: boolean
  sortOrder?: number
}) {
  const count = await prisma.page.count()
  return prisma.page.create({
    data: {
      name: data.name,
      url: data.url,
      body: data.body,
      isVisible: data.isVisible ?? true,
      sortOrder: data.sortOrder ?? count,
    },
  })
}

export async function adminUpdatePage(
  id: string,
  data: {
    name?: string
    url?: string
    body?: string
    isVisible?: boolean
    sortOrder?: number
  }
) {
  const existing = await prisma.page.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Page')
  return prisma.page.update({ where: { id }, data })
}

export async function adminDeletePage(id: string) {
  const existing = await prisma.page.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Page')
  await prisma.page.delete({ where: { id } })
}