/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment, lazy } from 'react'

import Header from './Header'
import Footer from './Footer'
// import SuspenseDelay from './SuspenseDelay'

// const Footer = lazy(() => import('./Footer'))

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    {/* <SuspenseDelay fallback={null}> */}
      <Footer />
    {/* </SuspenseDelay> */}
  </Fragment>
)

export default Layout
