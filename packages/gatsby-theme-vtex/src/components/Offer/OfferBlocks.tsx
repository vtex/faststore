import React, { FC, Fragment } from 'react'
import { Box, Flex } from 'theme-ui'

import { SyncProductCommertialOffer } from '../../types/product'
import DiscountPercentage from './DiscountPercentage'
import ListPrice from './ListPrice'
import SellingPrice from './SellingPrice'
import Availability from './Availability'

interface OfferWithFormattedPrices extends SyncProductCommertialOffer {
  formattedSellingPrice?: string
  formattedListPrice?: string
}

export type OfferBlocksProps = {
  offer: OfferWithFormattedPrices
  variant: string
}

const OfferBlocks: FC<OfferBlocksProps> = ({ offer, variant }) => {
  return (
    <Fragment>
      <ListPrice variant={variant} offer={offer} />
      <SellingPrice variant={variant} offer={offer} />
      <DiscountPercentage variant={variant} offer={offer} />
    </Fragment>
  )
}

export default OfferBlocks
