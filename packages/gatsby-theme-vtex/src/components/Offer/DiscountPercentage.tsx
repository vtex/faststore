import React, { FC } from 'react'
import { Flex } from '@vtex/store-ui'

interface Props {
  offer: {
    price: number
    listPrice: number
  }
  variant: string
}

const DiscountPercentage: FC<Props> = ({ offer, variant }) => {
  if (offer.price === offer.listPrice) {
    return null
  }

  const relation = Math.round((offer.price / offer.listPrice) * 100)
  const discount = 100 - relation

  return <Flex variant={`${variant}.discountBadge`}>-{discount}%</Flex>
}

export default DiscountPercentage
