import { Item, Seller } from '@vtex/gatsby-source-vtex'

export const findBestSeller = (skus: Item[]): Seller | undefined => {
  let bestSeller = skus[0]?.sellers?.[0]

  if (!bestSeller) {
    return
  }

  for (const sku of skus) {
    for (const seller of sku.sellers) {
      const { commertialOffer } = seller
      if (
        commertialOffer.AvailableQuantity > 0 &&
        commertialOffer.Price < bestSeller.commertialOffer.Price
      ) {
        bestSeller = seller
      }
    }
  }
  return bestSeller
}
