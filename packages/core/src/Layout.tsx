import type { PropsWithChildren } from 'react'
import { lazy, Suspense } from 'react'

import { useUI } from '@faststore/ui'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))

function Layout({ children }: PropsWithChildren) {
  const { cart: displayCart } = useUI()

  return (
    <>
      {children}

      {displayCart && (
        <Suspense fallback={null}>
          <CartSidebar />
        </Suspense>
      )}
    </>
  )
}

export default Layout
