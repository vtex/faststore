/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy } from 'react'

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
