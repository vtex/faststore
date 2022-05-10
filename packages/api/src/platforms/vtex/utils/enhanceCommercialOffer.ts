import type {
  CommertialOffer,
  Seller,
} from '../clients/search/types/ProductSearchResult'
import type { EnhancedSku } from './enhanceSku'

export type EnhancedCommercialOffer = CommertialOffer & {
  seller: Seller
  product: EnhancedSku
}

export const enhanceCommercialOffer = ({
  offer,
  seller,
  product,
}: {
  offer: CommertialOffer
  seller: Seller
  product: EnhancedSku
}): EnhancedCommercialOffer => ({
  ...offer,
  product,
  seller,
})
