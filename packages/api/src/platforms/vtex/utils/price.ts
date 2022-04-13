import type {
  CommertialOffer,
  Item,
} from '../clients/search/types/ProductSearchResult'
import { getFirstSeller } from './productStock'

export const getItemPriceByKey = (
  item: Item,
  key: keyof CommertialOffer
): number => getFirstSeller(item.sellers)?.commertialOffer[key] ?? 0
