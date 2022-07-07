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
    const highOffer = availableOffers[availableOffers.length - 1]

    return highOffer != null ? price(highOffer) : 0
  },
  lowPrice: (offers) => {
    const [lowOffer] = offers.filter(inStock)

    return lowOffer ? price(lowOffer) : 0
  },
  offerCount: (offers) => offers.length,
  priceCurrency: async (_, __, ctx) => {
    const { 
      loaders: { salesChannelLoader }, 
      storage: { channel } 
    } = ctx

    const sc = await salesChannelLoader.load(channel.salesChannel);
    
    return sc.CurrencyCode ?? '';
  },
  offers: (offers) => offers,
}
