import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import cn from 'clsx'
import s from './CategoryBar.module.css'

export interface Category {
  name: string
  slug: string
  image: string
  color?: string // لون خلفية الدائرة
}

interface Props {
  className?: string
  categories?: Category[]
  allHref?: string // رابط صفحة الفئات
}

// بدّل الصور بصورك (حطهن بـ public/images/categories)
const DEFAULT_CATEGORIES: Category[] = [
  { name: 'الجمال', slug: 'beauty', image: '/images/categories/beauty.png', color: '#f9a8c0' },
  { name: 'النساء', slug: 'women', image: '/images/categories/women.png', color: '#c8102e' },
  { name: 'الرجال', slug: 'men', image: '/images/categories/men.png', color: '#4b2e4f' },
  { name: 'المواليد والأطفال', slug: 'kids', image: '/images/categories/kids.png', color: '#c97b4a' },
  { name: 'المعدات الرياضية', slug: 'sports', image: '/images/categories/sports.png', color: '#e8603c' },
]

const CategoryBar: FC<Props> = ({
  className,
  categories = DEFAULT_CATEGORIES,
  allHref = '/categories',
}) => {
  return (
    <nav dir="rtl" aria-label="الفئات" className={cn(s.root, className)}>
      <ul className={s.list}>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link href={`/categories/${cat.slug}`} className={s.item}>
              <span className={s.thumb} style={{ backgroundColor: cat.color }}>
                <Image
                  src={cat.image}
                  alt=""
                  fill
                  sizes="30px"
                  className={s.img}
                />
              </span>
              <span className={s.label}>{cat.name}</span>
            </Link>
          </li>
        ))}

        {/* أيقونة كل الفئات */}
        <li>
          <Link href={allHref} className={s.allLink} aria-label="كل الفئات" title="كل الفئات">
            <svg viewBox="0 0 24 24" className={s.gridIcon} fill="currentColor">
              <rect x="3" y="3" width="8" height="8" rx="2.5" />
              <rect x="13" y="3" width="8" height="8" rx="2.5" />
              <rect x="3" y="13" width="8" height="8" rx="2.5" />
              <rect x="13" y="13" width="8" height="8" rx="2.5" />
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default CategoryBar