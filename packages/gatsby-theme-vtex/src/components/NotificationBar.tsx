import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  text: string
  variant?: string
}

const NotificationBar: FC<Props> = ({ text, variant = 'notification-bar' }) => (
  <Box variant={variant}>{text}</Box>
)

export default NotificationBar
