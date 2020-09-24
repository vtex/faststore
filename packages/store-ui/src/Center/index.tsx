/** @jsx jsx */
import { FC } from 'react'
import { Box, jsx } from 'theme-ui'

interface Props {
  width?: string
  height?: string
}

const Center: FC<Props> = ({ children, width = '100%', height = '100%' }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height,
      width,
    }}
  >
    {children}
  </Box>
)

export default Center
