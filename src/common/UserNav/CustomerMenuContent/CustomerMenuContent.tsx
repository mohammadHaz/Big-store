import cn from 'clsx'
import { useTheme } from 'next-themes'
import { useRouter , usePathname } from 'next/navigation'
import { Moon, Sun } from '@components/icons'
import s from './CustomerMenuContent.module.css'
import { useAuthStore } from '@store/auth/auth.store'
import {
  DropdownContent,
  DropdownMenuItem,
} from '@components/ui/Dropdown/Dropdown'

const LINKS = [
  {
    name: 'My Orders',
    href: '/orders',
  },
  {
    name: 'My Profile',
    href: '/profile',
  },
  {
    name: 'My Cart',
    href: '/cart',
  },
]

export default function CustomerMenuContent() {
  const router = useRouter()
  const storeLogout = useAuthStore((state) => state.logout)
  const logout = async () => {
    await storeLogout()
    router.push('/')
  }
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  function handleClick(href: string) {
    router.push(href)
  }

  return (
    <DropdownContent sideOffset={10} id="CustomerMenuContent">
      {LINKS.map(({ name, href }) => (
        <DropdownMenuItem key={href}>
          <a
            className={cn(s.link, {
              [s.active]: pathname === href,
            })}
            onClick={() => handleClick(href)}
          >
            {name}
          </a>
        </DropdownMenuItem>
      ))}
      <DropdownMenuItem>
        <a
          className={cn(s.link, 'justify-between')}
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }}
        >
          <div>
            Theme: <strong>{theme}</strong>{' '}
          </div>
          <div className="ml-3">
            {theme == 'dark' ? (
              <Moon width={20} height={20} />
            ) : (
              <Sun width={20} height={20} />
            )}
          </div>
        </a>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <a
          className={cn(s.link, 'border-t border-accent-2 mt-4')}
          onClick={() => logout()}
        >
          Logout
        </a>
      </DropdownMenuItem>
    </DropdownContent>
  )
}
