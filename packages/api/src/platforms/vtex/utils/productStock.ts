import type {
  Item,
  Seller,
  CommertialOffer,
} from '../clients/search/types/ProductSearchResult'

export const inStock = (item: Item) =>
  item.sellers.find((seller) => seller.commertialOffer.AvailableQuantity > 0)

export const getFirstSeller = (sellers: Seller[]): Seller | undefined =>
  sellers[0]

export const getItemPriceByKey = (
  item: Item,
  key: keyof CommertialOffer
): number => getFirstSeller(item.sellers)?.commertialOffer[key] ?? 0

// Smallest Available Selling Price First
export const sortOfferByPrice = (items: Item[]): Item[] =>
  items.sort((a, b) => {
    if (inStock(a) && !inStock(b)) {
      return -1
    }

    if (!inStock(a) && inStock(b)) {
      return 1
    }

    return getItemPriceByKey(a, 'Price') - getItemPriceByKey(b, 'Price')
  })

export const inStockOrderFormItem = (availability: string) =>
  availability === 'available'
