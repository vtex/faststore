import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

interface Props {
  variant: string
}

const OfferPrice: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.price`}>{children}</Box>
)

export default OfferPrice
