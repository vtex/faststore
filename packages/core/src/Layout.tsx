import { lazy, Suspense } from 'react'
import type { PropsWithChildren } from 'react'

import Alert from 'src/components/common/Alert'
import Footer from 'src/components/common/Footer'
import Navbar from 'src/components/common/Navbar'
import Toast from 'src/components/common/Toast'
import RegionalizationBar from 'src/components/regionalization/RegionalizationBar'
import Icon from 'src/components/ui/Icon'
import { useUI } from '@faststore/ui'

const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))
const RegionModal = lazy(
  () => import('src/components/regionalization/RegionalizationModal')
)

function Layout({ children }: PropsWithChildren) {
  const { cart: displayCart, modal: displayModal } = useUI()

  return (
    <>
      <Alert
        icon={<Icon name="Bell" />}
        link={{ children: 'Buy now', href: '/office', target: '_self' }}
        dismissible
      >
        Get 10% off today:&nbsp;<span>NEW10</span>
      </Alert>

      <Navbar />

      <Toast />

      <main>
        <RegionalizationBar classes="display-mobile" />
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
