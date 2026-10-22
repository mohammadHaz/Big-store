import Link from 'next/link'
import s from './MenuSidebarView.module.css'
import { useUIStore } from "@store/ui/ui.store"
import SidebarLayout from '@components/common/SidebarLayout'
import type { Link as LinkProps } from './index'

export default function MenuSidebarView({
  links = [],
}: {
  links?: LinkProps[]
}) {
  const { closeSidebar } = useUIStore()

  return (
    <SidebarLayout handleClose={() => closeSidebar()}>
      <div className={s.root}>
        <nav>
          {/* `links` (navLinks in Layout.tsx) already starts with an "All"
              entry — it's shared with the desktop Navbar, which prepends its
              own separate "Store" link before mapping the same array. This
              component used to also hardcode its own "All" here, so it
              showed up twice. */}
          <ul>
            {links.map((l: LinkProps) => (
              <li
                key={l.href}
                className={s.item}
                onClick={() => closeSidebar()}
              >
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </SidebarLayout>
  )
}
