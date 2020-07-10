import React, { FC, useMemo } from 'react'

import { useCurrency } from '../../providers/Currency'
import { findBestSeller, Item } from '../../utils/seller'

export interface Props {
  sku?: Item
}

const SyncOffer: FC<Props> = ({ sku }) => {
  const [currency] = useCurrency()
  const seller = useMemo(() => sku && findBestSeller(sku), [sku])
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

export default SyncOffer
