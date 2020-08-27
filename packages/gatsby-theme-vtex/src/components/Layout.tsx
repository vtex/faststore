/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy } from 'react'

import Header from './Header'
import SuspenseScroll from './SuspenseScroll'

const loader = () => import('./Footer')

const Footer = lazy(loader)

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <SuspenseScroll fallback={null} preloader={loader}>
      <Footer />
    </SuspenseScroll>
  </Fragment>
)

export default Layout
