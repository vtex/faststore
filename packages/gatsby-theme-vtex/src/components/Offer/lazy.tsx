import React, { FC } from 'react'

import { findBestSeller } from '../../utils/seller'
import { useCurrency } from '../providers/Binding'
import { useAsyncProduct } from '../providers/AsyncProduct/controler'

const Offer: FC = () => {
  const [currency] = useCurrency()
  const { items } = useAsyncProduct()

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
