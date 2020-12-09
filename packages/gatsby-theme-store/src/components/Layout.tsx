import React, { Fragment, lazy } from 'react'
import type { FC } from 'react'

import Header from './Header'
import SuspenseViewport from './Suspense/Viewport'

const loader = () => import('./Footer')

const Footer = lazy(loader)

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <SuspenseViewport fallback={null} preloader={loader}>
      <Footer />
    </SuspenseViewport>
  </Fragment>
)

export default Layout
