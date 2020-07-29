import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { OfferBlocksProps } from './OfferBlocks'

const DiscountPercentage: FC<OfferBlocksProps> = ({ offer, variant }) => {
  if (!offer.discount) {
    return null
  }

  return <Box variant={`${variant}.discountBadge`}>-{offer.discount}%</Box>
}

export default DiscountPercentage
