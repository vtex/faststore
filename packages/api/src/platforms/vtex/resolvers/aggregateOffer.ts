import type { EnhancedSku } from '../utils/enhanceSku'
import type { Simulation } from '../clients/commerce/types/Simulation'

type Resolvers = (root: Simulation & { product: EnhancedSku }) => unknown

const inStock = (item: Simulation['items'][0]) =>
  item.availability === 'https://schema.org/InStock'

// Smallest Available Selling Price First
export const sortOfferByPrice = (
  items: Simulation['items']
): Simulation['items'] =>
  items.sort((a, b) => {
    if (inStock(a) && !inStock(b)) {
      return -1
    }

    if (!inStock(a) && inStock(b)) {
      return 1
    }

    return a.sellingPrice - b.sellingPrice
  })

export const StoreAggregateOffer: Record<string, Resolvers> = {
  highPrice: ({ items }) => {
    const availableItems = items.filter(inStock)
    const highPrice = availableItems.pop()?.sellingPrice

    return (highPrice ?? 0) / 1e2
  },
  lowPrice: ({ items }) => {
    const availableItems = items.filter(inStock)
    const lowPrice = availableItems[0]?.sellingPrice

    return (lowPrice ?? 0) / 1e2
  },
  offerCount: ({ items }) => items.length,
  priceCurrency: () => '',
  offers: ({ items, product }) => items.map((item) => ({ ...item, product })),
}
