import { Item, Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'

import { useCurrency } from './providers/Binding'

interface Options {
  product?: Product
}

const findBestCommertialOffer = (skus: Item[]) => {
  let bestSoFar = skus[0].sellers[0].commertialOffer
  for (const sku of skus) {
    for (const { commertialOffer } of sku.sellers) {
      if (
        commertialOffer.AvailableQuantity > 0 &&
        commertialOffer.Price < bestSoFar.Price
      ) {
        bestSoFar = commertialOffer
      }
    }
  }
  return bestSoFar
}

const Offer: FC<Options> = ({ product }) => {
  const [currency] = useCurrency()

  if (!product) {
    return <div>Loading Price Data</div>
  }

  const offer = findBestCommertialOffer(product.items)

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
