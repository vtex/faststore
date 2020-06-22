import React, { FC } from 'react'
import { Box } from 'theme-ui'

import Header from './Header'

const Layout: FC = ({ children }) => (
  <>
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
  </>
)

export default Layout
