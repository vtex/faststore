import React, { FC } from 'react'
import { Box, Flex } from 'theme-ui'

import { SyncProductCommertialOffer } from '../../types/product'
import DiscountPercentage from './DiscountPercentage'
import ItemAvailability from './ItemAvailability'
import ListPrice from './ListPrice'
import Price from './Price'

export interface Props {
  offer?: SyncProductCommertialOffer
  variant?: string
}

const SyncOffer: FC<Props> = ({ offer, variant = '' }) => {
  if (offer?.AvailableQuantity === 0) {
    return <div>Product Unavailable</div>
  }

  return (
    <>
      <Box>
        <ListPrice variant={variant} offer={offer} />
        <Flex>
          <Price offer={offer} />
          <DiscountPercentage offer={offer} variant={variant} />
        </Flex>
      </Box>
      <ItemAvailability offer={offer} />
    </>
  )
}

export default SyncOffer
