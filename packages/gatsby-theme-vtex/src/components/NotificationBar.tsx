import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

interface Props {
  text: string
  variant?: string
}

const StoreHeaderNotificationBar: FC<Props> = ({ text, variant }) => (
  <Box variant={variant}>{text}</Box>
)

export default StoreHeaderNotificationBar
