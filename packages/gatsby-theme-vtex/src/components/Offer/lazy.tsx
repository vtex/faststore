import React, { FC } from 'react'

import { findBestSeller } from '../../utils/seller'
import { useAsyncProduct } from '../providers/AsyncProducts/controler'
import { useCurrency } from '../providers/Binding'
import { OfferPreview } from './preview'

export interface Props {
  index: number
}

const Offer: FC<Props> = ({ index }) => {
  const [currency] = useCurrency()
  const maybeProduct = useAsyncProduct(index)

  if (!maybeProduct) {
    return <OfferPreview />
  }

  const { items } = maybeProduct
  const seller = findBestSeller(items)
  const offer = seller?.commertialOffer

  if (!offer || offer.AvailableQuantity === 0) {
    return <div>Product Unavailable</div>
  }

  return (
    <>
      <div>
        {offer.Price}
        {currency}
      </div>
      <div>{offer.AvailableQuantity} units left</div>
    </>
  )
}

export default Offer
