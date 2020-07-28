import React, { FC } from 'react'
import Box from '@material-ui/core/Box'

const Container: FC = ({ children }) => (
  <Box margin="0 auto" width="100%" maxWidth="100%">
    <main>{children}</main>
  </Box>
)

export default Container
