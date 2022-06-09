import { inStock, price } from '../utils/productStock'
import type { StoreProduct } from './product'
import type { PromiseType } from '../../../typings'
import type { Resolver } from '..'

type Root = PromiseType<ReturnType<typeof StoreProduct.offers>>

export const StoreAggregateOffer: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, Root>
} = {
  highPrice: (offers) => {
    const availableOffers = offers.filter(inStock)

    return price(availableOffers[availableOffers.length - 1]) ?? 0
  },
  lowPrice: (offers) => {
    const availableOffers = offers.filter(inStock)

    return price(availableOffers[0]) ?? 0
  },
  offerCount: (offers) => offers.length,
  priceCurrency: () => '',
  offers: (offers) => offers,
}
