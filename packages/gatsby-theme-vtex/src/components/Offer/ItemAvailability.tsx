import React, { FC } from 'react'
import { Box } from 'theme-ui'
// import Skeleton from 'react-loading-skeleton'

import { SyncProductCommertialOffer } from '../../types/product'

export interface Props {
  offer?: SyncProductCommertialOffer
  variant?: string
}

const ItemAvailability: FC<Props> = ({ offer, variant = '' }) => (
  <Box variant={`${variant}-availability`}>
    {!offer ? null : `${offer.AvailableQuantity} units left!`}
  </Box>
)

export default ItemAvailability
