import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant: string
}

const OfferDiscountBadge: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.installments`}>{children}</Box>
)

export default OfferDiscountBadge
