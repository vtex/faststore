import React, { FC } from 'react'
import { Box } from 'theme-ui'

interface Props {
  variant: string
}

const OfferDiscountBadge: FC<Props> = ({ children, variant }) => {
  if (children === 0) {
    return null
  }

  return <Box variant={`offer.${variant}.discountBadge`}>{children}</Box>
}

export default OfferDiscountBadge
