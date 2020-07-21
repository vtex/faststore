/** @jsx jsx */
import { FC } from 'react'
import { jsx, Box } from 'theme-ui'

interface Props {
  text: string
  variant?: string
}

const NotificationBar: FC<Props> = ({ text, variant = 'notification-bar' }) => (
  <Box variant={variant}>{text}</Box>
)

export default NotificationBar
