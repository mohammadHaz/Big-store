"use client"
import { FC, Suspense } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import cn from 'clsx'

interface Link {
  href: string
  label: string
  highlight?: boolean
}

interface NavbarProps {
  links?: Link[]
}

const Navbar: FC<NavbarProps> = ({ links }) => (
  <NavbarRoot>
    <Container  clean className="  mx-auto
    w-[calc(100%-15px)] 
    rounded-3xl
    border border-white/80
    px-3
    text-black
    shadow-[0_8px_32px_rgba(0,0,0,0.08)]
    backdrop-blur-2xl
    transition-all duration-300
    supports-[backdrop-filter]:bg-white/65">
      <div className={s.nav}>
        <div className="flex items-center flex-1">
          <Link href="/" className={s.logo} aria-label="Logo">
                  <Logo />

          </Link>
          <nav className={s.navMenu}>    
            {links?.map((l) => (
              <Link href={l.href} key={l.href}  className={cn(s.link, l.highlight && s.linkSale)}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        {process.env.NEXT_PUBLIC_COMMERCE_SEARCH_ENABLED === 'true' && (
          <div className="justify-center flex-1 hidden lg:flex">
            {/* Searchbar reads the ?q= param via useSearchParams(), which
                Next.js requires a Suspense boundary around — without it,
                `next build` fails to statically prerender any page that
                renders the navbar (i.e. every page, since Layout.tsx always
                renders it). */}
            <Suspense fallback={null}>
              <Searchbar />
            </Suspense>
          </div>
        )}
        <div className="flex items-center justify-end flex-1 space-x-8">
          <UserNav />
        </div>
      </div>
      {process.env.NEXT_PUBLIC_COMMERCE_SEARCH_ENABLED === 'true' && (
        <div className="flex pb-4 lg:px-6 lg:hidden">
          <Suspense fallback={null}>
            <Searchbar id="mobile-search" />
          </Suspense>
        </div>
      )}
    </Container>
  </NavbarRoot>
)

export default Navbar
