import React, { FC, lazy } from 'react'

import SuspenseViewport from './Suspense/Viewport'
import Header from './Header'

const loader = () => import('./Footer')

const Footer = lazy(loader)

const Layout: FC = ({ children }) => (
  <>
    <Header />
    {children}
    <SuspenseViewport fallback={null} preloader={loader}>
      <Footer />
    </SuspenseViewport>
  </>
)

export default Layout
