/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy } from 'react'

import Header from './Header'
import SuspenseSSR from './SuspenseSSR'

const Footer = lazy(() => import('./Footer'))

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <SuspenseSSR fallback={null}>
      <Footer />
    </SuspenseSSR>
  </Fragment>
)

export default Layout
