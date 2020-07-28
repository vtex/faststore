import React, { FC, Fragment } from 'react'
import { Link } from 'gatsby'
import Box from '@material-ui/core/Box'

import Header from './Header'
import NotificationBar from './NotificationBar'

const OverMenu = () => (
  <Box
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      background: '#02003d',
      minHeight: '48px',
      color: 'muted',
      fontSize: 1,
      padding: '16px',
    }}
  >
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
  </Box>
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
