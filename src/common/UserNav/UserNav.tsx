"use client"
import cn from 'clsx'
import Link from 'next/link'
import s from './UserNav.module.css'
import { Avatar } from '@components/common'
import { useUIStore } from "@store/ui/ui.store"
import { useAuthStore } from "@store/auth/auth.store"
import { useCartStore } from "@store/cart/cart.store"
import { useWishlistStore } from "@store/wishlist/wishlist.store"
import { Heart, Bag, Menu } from '@components/icons'
import CustomerMenuContent from './CustomerMenuContent'
import React from 'react'
import {
  Dropdown,
  DropdownTrigger as DropdownTriggerInst,
  Button,
} from '@components/ui'

import type { LineItem } from '@lib/api'

const countItem = (count: number, item: LineItem) => count + item.quantity

const UserNav: React.FC<{
  className?: string
}> = ({ className }) => {
  const cart = useCartStore((state) => state.cart)
  const wishlist = useWishlistStore((state) => state.wishlist)
  const user = useAuthStore((state) => state.user)
  const isCustomerLoggedIn = !!user
  const { closeSidebarIfPresent, openModal, setSidebarView, openSidebar } =
    useUIStore()
  const itemsCount = cart?.lineItems?.reduce(countItem, 0) ?? 0
  const wishlistCount = wishlist?.items.length ?? 0
  const DropdownTrigger = isCustomerLoggedIn
    ? DropdownTriggerInst
    : React.Fragment

  return (
    <nav className={cn(s.root, className)}>
      <ul className={s.list}>
        {process.env.NEXT_PUBLIC_COMMERCE_CART_ENABLED === 'true' && (
          <li className={s.item}>
            <Button
              className={s.item}
              variant="naked"
              onClick={() => {
                setSidebarView('CART_VIEW')
                openSidebar()
              }}
              aria-label={`Cart items: ${itemsCount}`}
            >
              <Bag />
              {itemsCount > 0 && (
                <span className={s.bagCount}>{itemsCount}</span>
              )}
            </Button>
          </li>
        )}
        {process.env.NEXT_PUBLIC_COMMERCE_WISHLIST_ENABLED === 'true' && (
          <li className={s.item}>
            <Link href="/wishlist">
              <Button
                className={s.item}
                variant="naked"
                onClick={closeSidebarIfPresent}
                aria-label={`Wishlist items: ${wishlistCount}`}
              >
                <Heart />
                {wishlistCount > 0 && (
                  <span className={s.bagCount}>{wishlistCount}</span>
                )}
              </Button>
            </Link>
          </li>
        )}
        {process.env.NEXT_PUBLIC_COMMERCE_CUSTOMERAUTH_ENABLED === 'true' && (
          <li className={s.item}>
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  aria-label="Menu"
                  variant="naked"
                  className={s.avatarButton}
                  onClick={() => (isCustomerLoggedIn ? null : openModal())}
                >
                  <Avatar />
                </Button>
              </DropdownTrigger>
              <CustomerMenuContent />
            </Dropdown>
          </li>
        )}
        <li className={s.mobileMenu}>
          <Button
            className={s.item}
            variant="naked"
            onClick={() => {
              setSidebarView('MOBILE_MENU_VIEW')
              openSidebar()
            }}
          >
            <Menu />
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export default UserNav
