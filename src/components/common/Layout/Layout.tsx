"use client"

import cn from "clsx"
import dynamic from "next/dynamic"
import s from "./Layout.module.css"

import { Navbar ,Footer} from "@/components/common"
import { Sidebar, Button, LoadingDots } from "@/components/ui"

import LoginView from "@/components/auth/LoginView"
// import CartSidebarView from "@/components/cart/CartSidebarView"
// import ShippingView from "@/components/checkout/ShippingView"
// import PaymentMethodView from "@/components/checkout/PaymentMethodView"
// import CheckoutSidebarView from "@/components/checkout/CheckoutSidebarView"
import { MenuSidebarView } from "@/components/common/UserNav"
// import { CheckoutProvider } from "@/components/checkout/context"
import type { Link as LinkProps } from '../UserNav/MenuSidebarView'

import { useUIStore } from "@store/ui/ui.store"
import { useAcceptCookies } from "@/lib/hooks/useAcceptCookies"
import CartSidebarView from "@/components/cart/CartSidebarView/CartSidebarView";



const navLinks = [
  { href: '/search', label: 'All' },
  { href: '/search?sort=latest-desc', label: 'New Arrivals' },
  { href: '/search?sort=trending-desc', label: 'Trending' },
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
        {/*{sidebarView === "SHIPPING_VIEW" && <ShippingView />}
      {sidebarView === "PAYMENT_METHOD_VIEW" && <PaymentMethodView />}
      {sidebarView === "CHECKOUT_VIEW" && <CheckoutSidebarView />} */}
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
  const navBarlinks = navLinks.slice(0, 2).map((c) => ({
    label: c.label,
    href: c.href,
  }))
  return (
    <div className={cn(s.root)}>
      <Navbar links={navLinks} />

      <main className="fit">{children}</main>

      <Footer links={navBarlinks} />

      <ModalUI />

      {/* <CheckoutProvider> */}
        <SidebarUI links={navLinks}/>
      {/* </CheckoutProvider> */}

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