import React, { FC } from 'react'
import { Flex } from '@vtex/store-ui'

interface Props {
  offer: {
    Price: number
    ListPrice: number
  }
  variant: string
}

const DiscountPercentage: FC<Props> = ({ offer, variant }) => {
  if (offer.Price === offer.ListPrice) {
    return null
  }

  const relation = Math.round((offer.Price / offer.ListPrice) * 100)
  const discount = 100 - relation

  return <Flex variant={`${variant}.discountBadge`}>-{discount}%</Flex>
}

export default DiscountPercentage
