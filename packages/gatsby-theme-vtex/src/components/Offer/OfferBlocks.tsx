import React, { FC, Fragment } from 'react'
import { Box, Flex } from 'theme-ui'

import { SyncProductCommertialOffer } from '../../types/product'
import DiscountPercentage from './DiscountPercentage'
import ListPrice from './ListPrice'
import SellingPrice from './SellingPrice'
import Availability from './Availability'
import Installments from './Installments'

export type OfferBlocksProps = {
  offer: SyncProductCommertialOffer
  variant: string
}

const OfferBlocks: FC<OfferBlocksProps> = ({ offer, variant }) => {
  return (
    <Fragment>
      <ListPrice variant={variant} offer={offer} />
      <Flex sx={{ alignItems: 'center' }}>
        <Box>
          <SellingPrice variant={variant} offer={offer} />
        </Box>
        <DiscountPercentage variant={variant} offer={offer} />
      </Flex>
      <Availability variant={variant} offer={offer} />
      <Installments variant={variant} offer={offer} />
    </Fragment>
  )
}

export default OfferBlocks
