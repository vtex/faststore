import React, { FC, Fragment, lazy } from 'react'

import SuspenseViewport from './Suspense/Viewport'
import Header from './Header'

const loader = () => import('./Footer')

const Footer = lazy(loader)

const Layout: FC = ({ children }) => {
  // eslint-disable-next-line no-console
  console.log('Layout')

  return (
    <Fragment>
      <Header />
      {children}
      <SuspenseViewport fallback={null} preloader={loader}>
        <Footer />
      </SuspenseViewport>
    </Fragment>
  )
}

export default Layout
