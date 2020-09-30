import React, { FC } from 'react'

import OfferListPrice from './ListPrice'
import OfferPrice from './Price'
import OfferDiscountBagde from './DiscountBadge'

interface Props {
  commercialOffer: {
    price: number
    listPrice: number
  }
  variant?: string
}

const Offer: FC<Props> = ({
  commercialOffer: { price, listPrice },
  variant = 'default',
}) => (
  <>
    <OfferDiscountBagde variant={variant} price={price} listPrice={listPrice} />
    <OfferListPrice variant={variant} price={price} listPrice={listPrice} />
    <OfferPrice variant={variant} price={price} />
  </>
)

export default Offer
