import React, { FC } from 'react'
import { Flex } from '@vtex/store-ui'

import { useDiscountPercentage } from '../../sdk/offer/useDiscountPercentage'

interface Props {
  price: number
  listPrice: number
  variant: string
}

const DiscountBadge: FC<Props> = ({ price, listPrice, children, variant }) => {
  const discount = useDiscountPercentage({ price, listPrice })

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
