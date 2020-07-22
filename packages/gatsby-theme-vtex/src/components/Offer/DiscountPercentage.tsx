
import React, { FC } from 'react'
import { Flex } from 'theme-ui'
import { SyncProductCommertialOffer } from '../../types/product'

interface Props {
  offer: SyncProductCommertialOffer
  variant: string
}

const DiscountPercentage: FC<Props> = ({ offer, variant }) => {
  if (offer.Price === offer.ListPrice) {
    return null
  }
  const relation = Math.round(offer.Price / offer.ListPrice * 100)
  const discount = 100 - relation

  return (
    <Flex variant={`${variant}-discountBadge`}>
      -{discount}%
    </Flex>
  )
}

export default DiscountPercentage
