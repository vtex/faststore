import React, { FC } from 'react'
import { Box } from 'theme-ui'

import { OfferBlocksProps } from './OfferBlocks'

const ListPrice: FC<OfferBlocksProps> = ({ offer, variant }) => {
  return <Box variant={`${variant}.listPrice`}>{offer.formattedListPrice}</Box>
}

export default ListPrice
