import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant?: string
}

const GiftListTitle: FC<Props> = ({ children, variant = 'default' }) => (
  <Box variant={`giftList.${variant}.title`}>{children}</Box>
)

export default GiftListTitle
