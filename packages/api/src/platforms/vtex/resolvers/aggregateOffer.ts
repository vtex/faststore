import { inStock, price } from '../utils/productStock'
import type { StoreProduct } from './product'
import type { PromiseType } from '../../../typings'
import type { Resolver } from '..'
import { withTax } from '../utils/taxes'

export type Root = PromiseType<ReturnType<typeof StoreProduct.offers>>

const getHighPrice = (
  offers: Root,
  options: { includeTaxes: boolean } = { includeTaxes: false }
) => {
  const availableOffers = offers.filter(inStock)
  const highOffer = availableOffers[availableOffers.length - 1]
  const highPrice = highOffer ? price(highOffer) : 0
  if (!options.includeTaxes) {
    return highPrice
  }

  return withTax(highPrice, highOffer?.Tax, highOffer?.product?.unitMultiplier)
}

const getLowPrice = (
  offers: Root,
  options: { includeTaxes: boolean } = { includeTaxes: false }
) => {
  const [lowOffer] = offers.filter(inStock)

  const lowPrice = lowOffer ? price(lowOffer) : 0

  if (!options.includeTaxes) {
    return lowPrice
  }

  return withTax(lowPrice, lowOffer?.Tax, lowOffer?.product?.unitMultiplier)
}

export const StoreAggregateOffer: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, Root>
} = {
  highPrice: (offers) => getHighPrice(offers),
  lowPrice: (offers) => getLowPrice(offers),
  lowPriceWithTaxes: (offers) => getLowPrice(offers, { includeTaxes: true }),
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
