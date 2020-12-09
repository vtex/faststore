import { Box } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

interface Props {
  text: string
  variant?: string
}

const StoreHeaderNotificationBar: FC<Props> = ({ text, variant }) => (
  <Box variant={variant}>{text}</Box>
)

export default StoreHeaderNotificationBar
