/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment } from 'react'

import Header from './Header'
import Footer from './Footer'

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <Footer />
  </Fragment>
)

export default Layout
