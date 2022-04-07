import type { Item, Seller } from '../clients/search/types/ProductSearchResult'
import { getItemPriceByKey } from './price'

export const inStock = (item: Item) =>
  item.sellers.find((seller) => seller.commertialOffer.AvailableQuantity > 0)

export const getFirstSeller = (sellers: Seller[]): Seller | undefined =>
  sellers[0]

// Smallest Available Selling Price First
export const sortOfferByPrice = (items: Item[]): Item[] =>
  items.sort((a, b) => {
    if (inStock(a) && !inStock(b)) {
      return -1
    }

    if (!inStock(a) && inStock(b)) {
      return 1
    }

    // TODO: Check if the commertialOffer.Price is the sellingPrice
    return getItemPriceByKey(a, 'Price') - getItemPriceByKey(b, 'Price')
  })
