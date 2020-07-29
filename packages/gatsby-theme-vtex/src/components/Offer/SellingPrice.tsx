import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { usePrices } from './hooks/usePrices'
import { OfferBlocksProps } from './OfferBlocks'

const SellingPrice: FC<OfferBlocksProps> = ({ offer, variant }) => {
  const { formattedSellingPrice } = usePrices(offer)

  return <Box variant={`${variant}.price`}>{formattedSellingPrice}</Box>
}

export default SellingPrice
