import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'theme-ui'

import Header from './header'

const Layout: React.FC = ({ children }) => {
  return (
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
        <footer>
          © {new Date().getFullYear()}, Built with Gatsby and VTEX
        </footer>
      </Box>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
