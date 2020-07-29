import React, { FC } from 'react'
import Box from '@material-ui/core/Box'

import Typography from './material-ui-components/Typography'

interface Props {
  text: string
}

const NotificationBar: FC<Props> = ({ text }) => (
  <Box
    minHeight="48px"
    bgcolor="#e0efe0"
    alignItems="center"
    justifyContent="center"
    fontSize={0}
    display={['none', 'none', 'flex']}
  >
    <Typography
      color="primary"
      variant="button"
      style={{
        textDecoration: 'underline',
      }}
    >
      {text}
    </Typography>
  </Box>
)

export default NotificationBar
