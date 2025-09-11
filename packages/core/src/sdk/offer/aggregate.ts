import type { Item, Seller } from '@vtex/faststore-api'
import type { EnhancedCommercialOffer } from './enhance'
import { inStock, price } from './sort'

type Root = EnhancedCommercialOffer<Seller, Item>

const withTax = (price: number, tax = 0, unitMultiplier = 1) => {
  const unitTax = tax / unitMultiplier
  return Math.round((price + unitTax) * 100) / 100
}

const getHighPrice = (
  offers: Root[],
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
  offers: Root[],
  options: { includeTaxes: boolean } = { includeTaxes: false }
) => {
  const [lowOffer] = offers.filter(inStock)

  const lowPrice = lowOffer ? price(lowOffer) : 0

  if (!options.includeTaxes) {
    return lowPrice
  }

  return withTax(lowPrice, lowOffer?.Tax, lowOffer?.product?.unitMultiplier)
}

export function aggregateOffer(offers: Root[]) {
  return {
    highPrice: getHighPrice(offers),
    lowPrice: getLowPrice(offers),
    lowPriceWithTaxes: getLowPrice(offers, { includeTaxes: true }),
    offerCount: offers.length,
  }
}
