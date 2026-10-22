import Link from 'next/link'
import { FC } from 'react'
import cn from 'clsx'
import { Logo, Container } from '@components/ui'
import s from './Footer.module.css'

interface FooterLink {
  href: string
  label: string
}

interface FooterProps {
  className?: string
  links?: FooterLink[]
}

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/search' },
      { label: 'New Arrivals', href: '/search?sort=latest-desc' },
      { label: 'Best Sellers', href: '/search?sort=trending-desc' },
      { label: 'Sale', href: '/search/sale' },
    ],
  },
  {
    title: 'My Account',
    links: [
      { label: 'Cart', href: '/cart' },
      { label: 'Wishlist', href: '/wishlist' },
      { label: 'Track Order', href: '/orders' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
]

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/961XXXXXXXX',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    ),
  },
]

const Footer: FC<FooterProps> = ({ className, links = [] }) => {
  // أي روابط إضافية جاية من الـ props بتنضاف لعمود Help
  const columns = COLUMNS.map((col) =>
    col.title === 'Help' ? { ...col, links: [...col.links, ...links] } : col
  )

    return (
      <footer className={cn(s.root, className)}>
        <Container>
          <div className={s.top}>
            <div className={s.brand}>
              <Link href="/" className={s.logo}>
                <span className={s.logoIcon}>
                  <Logo />
                </span>
                <span className={s.logoText}>Mova</span>
              </Link>
              <div className={s.socials}>
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={s.social}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className={s.columns}>
              {columns.map((col) => (
                <div key={col.title}>
                  <h3 className={s.columnTitle}>{col.title}</h3>
                  <ul className={s.columnList}>
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={s.link}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={s.bottom}>
            <span>&copy; {new Date().getFullYear()} Mova. All rights reserved.</span>
            <div className={s.bottomInfo}>
              <span>Cash on delivery</span>
              <span>Delivery all over Lebanon</span>
            </div>
          </div>
        </Container>
      </footer>
    )
}

export default Footer