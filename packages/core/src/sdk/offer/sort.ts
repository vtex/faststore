import type { CommertialOffer } from '@faststore/api'

export const inStock = (offer: Pick<CommertialOffer, 'AvailableQuantity'>) =>
  offer.AvailableQuantity > 0

export const price = (offer: Pick<CommertialOffer, 'spotPrice'>) =>
  offer.spotPrice ?? 0

export const availability = (available: boolean) =>
  available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

export const bestOfferFirst = (
  a: Pick<CommertialOffer, 'AvailableQuantity' | 'spotPrice'>,
  b: Pick<CommertialOffer, 'AvailableQuantity' | 'spotPrice'>
) => {
  if (inStock(a) && !inStock(b)) {
    return -1
  }

  if (!inStock(a) && inStock(b)) {
    return 1
  }

  return price(a) - price(b)
}

export const inStockOrderFormItem = (itemAvailability: string) =>
  itemAvailability === 'available'
