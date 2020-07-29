import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { OfferBlocksProps } from './OfferBlocks'

const SellingPrice: FC<OfferBlocksProps> = ({ offer, variant }) => {
  return <Box variant={`${variant}.price`}>{offer.formattedPrice}</Box>
}

export default SellingPrice
