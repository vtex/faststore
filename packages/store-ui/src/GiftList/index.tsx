import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant?: string
}

const GiftList: FC<Props> = ({ variant = 'default', children }) => {
  return <Box variant={`giftList.${variant}.container`}>{children}</Box>
}

export default GiftList
