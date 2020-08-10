/** @jsx jsx */
import { FC } from 'react'
import { Box, jsx } from '@vtex/store-ui'

const Container: FC = ({ children }) => (
  <Box
    px={[2, 3, 4]}
    sx={{
      margin: '0 auto',
      width: '100%',
      maxWidth: ['100%', '100%', '96rem'],
    }}
  >
    <main>{children}</main>
  </Box>
)

export default Container
