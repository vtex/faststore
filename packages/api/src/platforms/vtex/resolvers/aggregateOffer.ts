import type { EnhancedSku } from '../utils/enhanceSku'
import type { Simulation } from '../clients/commerce/types/Simulation'

type Resolvers = (root: Simulation & { product: EnhancedSku }) => unknown

export const StoreAggregateOffer: Record<string, Resolvers> = {
  highPrice: ({ items }) =>
    items.reduce(
      (acc, curr) => (acc > curr.sellingPrice ? acc : curr.sellingPrice),
      items[0]?.sellingPrice ?? 0
    ) / 1e2,
  lowPrice: ({ items }) =>
    items.reduce(
      (acc, curr) => (acc < curr.sellingPrice ? acc : curr.sellingPrice),
      items[0]?.sellingPrice ?? 0
    ) / 1e2,
  offerCount: ({ items }) => items.length,
  priceCurrency: () => '',
  offers: ({ items, product }) => items.map((item) => ({ ...item, product })),
}
