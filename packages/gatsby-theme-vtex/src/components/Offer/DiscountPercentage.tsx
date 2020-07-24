import React, { FC } from 'react'
import { Flex } from 'theme-ui'
import Skeleton from 'react-loading-skeleton'

import { SyncProductCommertialOffer } from '../../types/product'

interface Props {
  offer?: SyncProductCommertialOffer
  variant: string
}

const DiscountPercentage: FC<Props> = ({ offer, variant }) => {
  const loading = !offer
  const relation = offer && Math.round((offer.Price / offer.ListPrice) * 100)
  const discount = relation && `-${100 - relation}%`

  return (
    <Flex variant={`${variant}-discountBadge`}>
      {loading ? null : discount}
    </Flex>
  )
}

export default DiscountPercentage
