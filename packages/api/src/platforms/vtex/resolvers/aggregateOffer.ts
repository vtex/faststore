import { inStock } from '../utils/productStock'
import type { EnhancedCommercialOffer } from '../utils/enhanceCommercialOffer'
import type { StoreProduct } from './product'
import type { PromiseType } from '../../../typings'
import type { Resolver } from '..'

type Root = PromiseType<ReturnType<typeof StoreProduct.offers>>

export const StoreAggregateOffer: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, EnhancedCommercialOffer[]>
} = {
  highPrice: (offers) => {
    const availableOffers = offers.filter(inStock)

    return availableOffers[availableOffers.length - 1]?.Price ?? 0
  },
  lowPrice: (offers) => {
    const availableOffers = offers.filter(inStock)

    return availableOffers[0]?.Price ?? 0
  },
  offerCount: (offers) => offers.length,
  priceCurrency: () => '',
  offers: (offers) => offers,
}
