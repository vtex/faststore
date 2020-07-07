import React, { FC } from 'react'

import { findBestSeller } from '../../utils/seller'
import { useAsyncProduct } from '../providers/AsyncProducts/controler'
import { useCurrency } from '../providers/Binding'

export interface Props {
  index: number
}

const Offer: FC<Props> = ({ index }) => {
  const [currency] = useCurrency()
  const { items } = useAsyncProduct(index)

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
