/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy } from 'react'

import Header from './Header'
import Suspense from './SuspenseDelay'

const Footer = lazy(() => import('./Footer'))

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  </Fragment>
)

export default Layout
