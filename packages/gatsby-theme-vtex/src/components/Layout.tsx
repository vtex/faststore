/** @jsx jsx */
import { Link } from 'gatsby'
import { FC, Fragment } from 'react'
import { Box, jsx } from '@vtex/store-ui'

import Container from './Container'
import Footer from './Footer'
import Header from './Header'
import NotificationBar from './NotificationBar'
import SuspenseSSR from './SuspenseSSR'

const OverMenu = () => (
  <Box variant="overmenu">
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
    <SuspenseSSR fallback={null}>
      <Container>
        <Footer />
      </Container>
    </SuspenseSSR>
  </Fragment>
)

export default Layout
