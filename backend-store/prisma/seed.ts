// prisma/seed.ts

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  await prisma.category.upsert({
    where: { slug: 't-shirts' },
    update: {},
    create: { name: 'T-Shirts', slug: 't-shirts', path: '/t-shirts' },
  })

  await prisma.brand.upsert({
    where: { slug: 'acme' },
    update: {},
    create: { name: 'Acme', slug: 'acme', path: '/acme' },
  })

  const tshirt = await prisma.product.upsert({
    where: { slug: 'classic-tee' },
    update: {},
    create: {
      name: 'Classic Tee',
      description: 'A comfortable everyday t-shirt.',
      sku: 'TSHIRT-001',
      slug: 'classic-tee',
      path: '/classic-tee',
      vendor: 'Acme',
      images: {
        create: [{ url: 'https://via.placeholder.com/800x600?text=Classic+Tee', alt: 'Classic Tee' }],
      },
      price: { create: { value: 29.99, currencyCode: 'USD', retailPrice: 39.99 } },
      options: {
        create: [
          {
            displayName: 'Size',
            values: { create: [{ label: 'S' }, { label: 'M' }, { label: 'L' }, { label: 'XL' }] },
          },
          {
            displayName: 'Color',
            values: {
              create: [
                { label: 'White', hexColors: ['#FFFFFF'] },
                { label: 'Black', hexColors: ['#000000'] },
              ],
            },
          },
        ],
      },
      variants: {
        create: [
          { sku: 'TSHIRT-S-WHITE', name: 'Classic Tee / S / White', priceValue: 29.99, priceCurrency: 'USD', retailPrice: 39.99 },
          { sku: 'TSHIRT-M-BLACK', name: 'Classic Tee / M / Black', priceValue: 29.99, priceCurrency: 'USD', retailPrice: 39.99 },
          { sku: 'TSHIRT-L-WHITE', name: 'Classic Tee / L / White', priceValue: 29.99, priceCurrency: 'USD', retailPrice: 39.99 },
        ],
      },
    },
  })

  console.log(`✅ Product: ${tshirt.name}`)

  const passwordHash = await bcrypt.hash('password123', 12)
  const user = await prisma.customer.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      passwordHash,
    },
  })

  console.log(`✅ Customer: ${user.email} / password: password123`)
  console.log('🎉 Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
