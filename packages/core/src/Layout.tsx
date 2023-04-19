import type { PropsWithChildren } from 'react'
import { lazy, Suspense } from 'react'

import { Icon, useUI } from '@faststore/ui'
import Alert from 'src/components/common/Alert'
import Footer from 'src/components/common/Footer'
import Navbar from 'src/components/navigation/Navbar'
import Toast from 'src/components/common/Toast'
import RegionBar from 'src/components/region/RegionBar'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(() => import('src/components/region/RegionModal'))

function Layout({ children }: PropsWithChildren) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <>
      {children}

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
