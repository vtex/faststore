import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { usePrices } from './hooks/usePrices'
import { OfferBlocksProps } from './OfferBlocks'

const DiscountPercentage: FC<OfferBlocksProps> = ({ offer, variant }) => {
  const { discount } = usePrices(offer)

  if (!discount) {
    return null
  }

  return <Box variant={`${variant}.discountBadge`}>-{discount}%</Box>
}

export default DiscountPercentage
