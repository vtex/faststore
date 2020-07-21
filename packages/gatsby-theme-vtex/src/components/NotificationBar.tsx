/** @jsx jsx */
import { FC } from 'react'
import { jsx, Box } from 'theme-ui'

interface Props {
  text: string
}

const NotificationBar: FC<Props> = ({ text }) => (
  <Box sx={{ variant: 'notification-bar' }}>{text}</Box>
)

export default NotificationBar
