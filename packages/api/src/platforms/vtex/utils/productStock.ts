import type { CommertialOffer } from '../clients/search/types/ProductSearchResult'

export const inStock = (offer: CommertialOffer) => offer.AvailableQuantity > 0

export const price = (offer: CommertialOffer) => offer.spotPrice ?? 0
export const sellingPrice = (offer: CommertialOffer) => offer.Price ?? 0

export const availability = (available: boolean) =>
  available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

// Smallest Available Selling Price First
export const bestOfferFirst = (a: CommertialOffer, b: CommertialOffer) => {
  if (inStock(a) && !inStock(b)) {
    return -1
  }

  if (!inStock(a) && inStock(b)) {
    return 1
  }

  return price(a) - price(b)
}

export const inStockOrderFormItem = (item: string) => item === 'available'
