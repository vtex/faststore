/** @jsx jsx */
import { jsx } from '@vtex/store-ui'
import { FC, Fragment } from 'react'

import Container from './Container'
import Footer from './Footer'
import Header from './Header'
import SuspenseSSR from './SuspenseSSR'

const Layout: FC = ({ children }) => (
  <Fragment>
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
