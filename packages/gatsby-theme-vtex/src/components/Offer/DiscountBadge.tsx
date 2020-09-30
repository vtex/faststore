import React, { FC } from 'react'
import { Flex } from '@vtex/store-ui'

import { useDiscountPercentage } from '../../sdk/offer/useDiscountPercentage'

interface Props {
  price: number
  listPrice: number
  variant: string
}

const OfferDiscountBadge: FC<Props> = ({
  price,
  listPrice,
  children,
  variant,
}) => {
  const discount = useDiscountPercentage({ price, listPrice })

  if (discount === 0) {
    return null
  }

  return (
    <Flex variant={`offer.${variant}.discountBadge`}>
      -{discount}%{children}
    </Flex>
  )
}

export default OfferDiscountBadge
