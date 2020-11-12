/** @jsx jsx */
import { jsx, Box } from '@vtex/store-ui'
import { FC } from 'react'

interface Props {
  variant?: string
}

const Container: FC<Props> = ({ variant, children }) => (
  <Box
    variant={`${variant}.paginationMiniatures.container`}
    sx={{
      mx: '5px',
      width: '80px',
      display: ['none', 'block'],
    }}
  >
    {children}
  </Box>
)

export default Container
