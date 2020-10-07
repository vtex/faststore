import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant?: string
}

const GiftListTitle: FC<Props> = ({ children, variant = 'default' }) => (
  <Box variant={`giftList.${variant}.title`}>{children}</Box>
)

export default GiftListTitle
