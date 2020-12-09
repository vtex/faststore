import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

interface Props {
  variant: string
}

const OfferDiscountBadge: FC<Props> = ({ children, variant }) => (
  <Box variant={`offer.${variant}.installments`}>{children}</Box>
)

export default OfferDiscountBadge
