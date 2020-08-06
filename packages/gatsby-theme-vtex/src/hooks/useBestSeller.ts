import { graphql } from 'gatsby'

import { UseBestSeller_SkuFragment } from '../components/Offer/__generated__/SyncOffer_sku.graphql'

export const fragment = graphql`
  fragment UseBestSeller_sku on VTEX_SKU {
    sellers {
      commertialOffer {
        AvailableQuantity
        Price
      }
    }
  }
`

export const useBestSeller = (sku: UseBestSeller_SkuFragment) => {
  let bestSeller = sku?.sellers?.[0]

  if (!bestSeller) {
    return
  }

  for (const seller of sku.sellers!) {
    const { commertialOffer } = seller!

    if (
      commertialOffer!.AvailableQuantity! > 0 &&
      commertialOffer!.Price! < bestSeller!.commertialOffer!.Price!
    ) {
      bestSeller = seller
    }
  }

  return bestSeller
}
