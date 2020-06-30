/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Box, jsx } from 'theme-ui'

import Header from './Header'

const Layout: FC = ({ children }) => (
  <Fragment>
    <Header />
    <Box
      px={[2, 3, 4]}
      sx={{
        margin: '0 auto',
        width: '100%',
        maxWidth: ['100%', '100%', '96rem'],
      }}
    >
      <main>{children}</main>
      <footer>© {new Date().getFullYear()}, Built with Gatsby and VTEX</footer>
    </Box>
  </Fragment>
)

export default Layout
