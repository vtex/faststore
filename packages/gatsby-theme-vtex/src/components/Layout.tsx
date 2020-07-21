/** @jsx jsx */
import { FC, Fragment } from 'react'
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'

import Header from './Header'
import NotificationBar from './NotificationBar'

const OverMenu = () => (
  <div sx={{ variant: 'overmenu' }}>
    <div>
      <Link to="/">Shop</Link>
    </div>
    <div>
      <Link to="/about">About us</Link>
    </div>
    <div sx={{ flexGrow: 1 }} />
    <div>
      <a href="https://vtex.com">visit vtex.com</a>
    </div>
  </div>
)

const Layout: FC = ({ children }) => (
  <Fragment>
    <NotificationBar text="SELECTED ITEMS ON SALE! CHECK IT OUT!" />
    <OverMenu />
    <Header />
    {children}
    <footer>© {new Date().getFullYear()}, Built with Gatsby and VTEX</footer>
  </Fragment>
)

export default Layout
