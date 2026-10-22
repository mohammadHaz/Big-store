"use client"

import cn from "clsx"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import s from "./Layout.module.css"

import { Navbar ,Footer, CategoryBar} from "@/components/common"
import { Sidebar, Button, LoadingDots } from "@/components/ui"

import LoginView from "@/components/auth/LoginView"
import { MenuSidebarView } from "@/components/common/UserNav"
import type { Link as LinkProps } from '../UserNav/MenuSidebarView'

import { useUIStore } from "@store/ui/ui.store"
import { useAuthStore } from "@store/auth/auth.store"
import { useCartStore } from "@store/cart/cart.store"
import { useWishlistStore } from "@store/wishlist/wishlist.store"
import { useAcceptCookies } from "@/lib/hooks/useAcceptCookies"
import CartSidebarView from "@/components/cart/CartSidebarView/CartSidebarView";



// "Trending" was dropped: it linked to sort=trending-desc, which the backend
// never implemented (searchProducts only recognizes price-asc/price-desc/
// latest-desc — see backend-store/src/operations/product.ts) — there's no
// trending/sales-count data to sort by, so it silently fell back to name-asc.
const navLinks = [
  { href: '/search?sort=latest-desc', label: 'New Arrivals', highlight: false },
  { href: '/search?sort=trending-desc', label: 'Best Sellers', highlight: false },
  { href: '/search/sale', label: 'Sale', highlight: true },
]

const Loading = () => (
  <div className="w-80 h-80 flex items-center justify-center">
    <LoadingDots />
  </div>
)

const SignUpView = dynamic(() => import("@/components/auth/SignUpView"), {
  loading: Loading,
})

const ForgotPassword = dynamic(() => import("@/components/auth/ForgotPassword"), {
  loading: Loading,
})

const FeatureBar = dynamic(() => import("@/components/common/FeatureBar"), {
  loading: Loading,
})

const Modal = dynamic(() => import("@/components/ui/Modal"), {
  ssr: false,
  loading: Loading,
})

function ModalUI() {
  const { displayModal, closeModal, modalView } = useUIStore()

  if (!displayModal) return null

  return (
    <Modal onClose={closeModal}>
      {modalView === "LOGIN_VIEW" && <LoginView />}
      {modalView === "SIGNUP_VIEW" && <SignUpView />}
      {modalView === "FORGOT_VIEW" && <ForgotPassword />}
    </Modal>
  )
}

const SidebarUI: React.FC<{ links: LinkProps[] }> = ({ links }) => {
  const { displaySidebar, closeSidebar, sidebarView } = useUIStore()

  if (!displaySidebar) return null

  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === "CART_VIEW" && <CartSidebarView />}
      {sidebarView === "MOBILE_MENU_VIEW" && <MenuSidebarView links={links} />}
    </Sidebar>
  )
}

export default function ClientLayout({
  children,

}: {
  children: React.ReactNode
}) {
  const { acceptedCookies, onAcceptCookies } = useAcceptCookies()
  const restoreSession = useAuthStore((state) => state.restoreSession)
  const fetchCart = useCartStore((state) => state.fetchCart)
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist)
  const hasRestored = useRef(false)

  useEffect(() => {
    if (hasRestored.current) return
    hasRestored.current = true
    if (process.env.NEXT_PUBLIC_COMMERCE_CUSTOMERAUTH_ENABLED === 'true') {
      restoreSession()
    }
    if (process.env.NEXT_PUBLIC_COMMERCE_CART_ENABLED === 'true') {
      fetchCart()
    }
    if (process.env.NEXT_PUBLIC_COMMERCE_WISHLIST_ENABLED === 'true') {
      fetchWishlist()
    }
  }, [restoreSession, fetchCart, fetchWishlist])

  const navBarlinks = navLinks.slice(0, 2).map((c) => ({
    label: c.label,
      href: c.href,
    }))
    return (
    <div className={cn(s.root)}>
      <Navbar links={navLinks} />
      <CategoryBar />

      <main className="fit">{children}</main>

      <Footer links={navBarlinks} />

      <ModalUI />

      <SidebarUI links={navLinks}/>

      <FeatureBar
        title="This site uses cookies to improve your experience."
        hide={acceptedCookies}
        action={
          <Button className="mx-5" onClick={onAcceptCookies}>
            Accept cookies
          </Button>
        }
      />
    </div>
  )
}