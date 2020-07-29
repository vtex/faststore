import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { usePrices } from './hooks/usePrices'
import { OfferBlocksProps } from './OfferBlocks'

const ListPrice: FC<OfferBlocksProps> = ({ offer, variant }) => {
  const { formattedListPrice } = usePrices(offer)

  return <Box variant={`${variant}.listPrice`}>{formattedListPrice}</Box>
}

export default ListPrice
