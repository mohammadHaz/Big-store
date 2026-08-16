import Link from 'next/link'
import { Github, Vercel } from '@components/icons'
import { Logo, Container } from '@components/ui'
import type { Page } from '../../../types/Page'
import  cn  from 'clsx'
import s from './Footer.module.css'
import { FC } from 'react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Search', href: '/search' },
  { label: 'Cart', href: '/cart' },
  { label: 'Wishlist', href: '/wishlist' },
]
interface Link {
  href: string
  label: string
}

interface FooterProps {
  className?: string
  links?: Link[]
}

const Footer:FC<FooterProps> = ({ className, links }) => {
//   const sitePages = links
//     .filter((link) => link.href && link.is_visible)
//     .sort(
//       (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
//     )
  const rootClassName = cn(s.root, className)

  const allLinks = [
    ...NAV_LINKS,
    ...links?.map((link) => ({
      label: link.label,
      href: link.href,
    })) || [],
  ]

  return (
    <footer className={rootClassName}>
       <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accent-2 py-12 text-primary bg-primary transition-colors duration-150">
          <div className="col-span-1 lg:col-span-2">
            <Link
              href="/"
              className="flex flex-initial items-center font-bold md:mr-24"
            >
              <span className="rounded-full border border-accent-6 mr-2">
                <Logo />
              </span>
              <span>ACME</span>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-7">
            <div className="grid md:grid-rows-4 md:grid-cols-3 md:grid-flow-col">
              {allLinks.map((page,index) => (
                <span key={index} className="py-3 md:py-0 md:pb-4">
                  <Link
                    href={page.href!}
                    className="text-accent-9 hover:text-accent-6 transition ease-in-out duration-150"
                  >
                    {page.label}
                  </Link>
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-1 lg:col-span-3 flex items-start lg:justify-end text-primary">
            <div className="flex space-x-4 items-center h-10">
              {/* <ThemeSwitcher />
              <I18nWidget /> */}
              <a
                className={s.link}
                aria-label="Github Repository"
                href="https://github.com/vercel/commerce"
              >
                <Github />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 pb-10 flex flex-col md:flex-row justify-between items-center space-y-4 text-accent-6 text-sm">
          <div>
            <span>&copy; {new Date().getFullYear()} ACME, Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center text-primary text-sm">
            <span className="text-primary">Created by</span>
            <a
              rel="noopener noreferrer"
              href="https://vercel.com"
              aria-label="Vercel.com Link"
              target="_blank"
              className="text-primary"
            >
              <Vercel
                className="inline-block h-6 ml-3 text-primary"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer