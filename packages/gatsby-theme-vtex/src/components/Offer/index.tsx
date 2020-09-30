import React, { FC } from 'react'

import ListPrice from './ListPrice'
import Price from './Price'
import DiscountBagde from './DiscountBadge'

interface Props {
  commercialOffer: {
    price: number
    listPrice: number
  }
  variant?: string
}

const Offer: FC<Props> = ({
  commercialOffer: { price, listPrice },
  variant = 'offer',
}) => (
  <>
    <DiscountBagde variant={variant} price={price} listPrice={listPrice} />
    <ListPrice variant={variant} price={price} listPrice={listPrice} />
    <Price variant={variant} price={price} />
  </>
)

export default Offer
