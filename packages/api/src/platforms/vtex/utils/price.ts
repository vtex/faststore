import type {
  CommertialOffer,
  Item,
} from '../clients/search/types/ProductSearchResult'
import { getFirstSeller } from './productStock'

export const getItemPriceByKey = (item: Item, key: keyof CommertialOffer) =>
  getFirstSeller(item.sellers)?.commertialOffer[key] ?? 0
