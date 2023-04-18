import type { PropsWithChildren } from 'react'
import { lazy, Suspense } from 'react'

import { Icon, useUI } from '@faststore/ui'
import Footer from 'src/components/common/Footer'
import Navbar from 'src/components/common/Navbar'
import Toast from 'src/components/common/Toast'
import RegionBar from 'src/components/region/RegionBar'
import { LayoutData } from './getLayout'
import Alert, { AlertProps } from 'src/components/sections/Alert/Alert'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(() => import('src/components/region/RegionModal'))

function Layout({ children, alert }: PropsWithChildren<LayoutData>) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <>
      <Alert {...(alert as AlertProps)} />

      <Navbar />

      <Toast />

      <main>
        <RegionBar className="display-mobile" />
        {children}
      </main>

      <Footer />

      {displayCart && (
        <Suspense fallback={null}>
          <CartSidebar />
        </Suspense>
      )}

      {displayModal && (
        <Suspense fallback={null}>
          <RegionModal />
        </Suspense>
      )}
    </>
  )
}

export default Layout
