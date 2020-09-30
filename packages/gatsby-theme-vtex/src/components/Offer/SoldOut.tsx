import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

interface Props {
  variant: string
}

const SoldOut: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.soldout`}>{children}</Box>
)

export default SoldOut
