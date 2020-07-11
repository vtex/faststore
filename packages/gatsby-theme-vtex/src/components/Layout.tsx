/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'

import Header from './Header'

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    {children}
    <footer>© {new Date().getFullYear()}, Built with Gatsby and VTEX</footer>
  </Fragment>
)

export default Layout
