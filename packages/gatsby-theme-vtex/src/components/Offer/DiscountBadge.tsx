import React, { FC } from 'react'
import { Flex } from '@vtex/store-ui'

import { useDiscountPercentage } from '../../sdk/offer/useDiscountPercentage'

interface Props {
  offer: {
    price: number
    listPrice: number
  }
  variant?: string
}

const DiscountBadge: FC<Props> = ({ offer, children, variant = 'offer' }) => {
  const discount = useDiscountPercentage(offer)

  if (discount === 0) {
    return null
  }

  return (
    <Flex variant={`${variant}.discountBadge`}>
      -{discount}%{children}
    </Flex>
  )
}

export default DiscountBadge
