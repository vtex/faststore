import type { PropsWithChildren } from 'react'
import { lazy, Suspense } from 'react'

import { useUI } from '@faststore/ui'

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
