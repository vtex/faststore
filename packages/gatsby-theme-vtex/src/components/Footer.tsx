/** @jsx jsx */
import { FC } from 'react'
import { Flex, jsx } from 'theme-ui'

const Footer: FC = () => (
  <Flex variant="footer" as="footer" sx={{ flexDirection: 'column' }}>
    © {new Date().getFullYear()}, Built with Gatsby and VTEX
  </Flex>
)

export default Footer
