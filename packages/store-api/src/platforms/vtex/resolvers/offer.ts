import type { Resolver } from '..'
import type { Item } from '../clients/commerce/types/Checkout'

export const StoreOffer: Record<string, Resolver<Item>> = {
  priceCurrency: () => '',
  priceValidUntil: ({ priceValidUntil }) => priceValidUntil ?? '',
  itemCondition: () => 'https://schema.org/NewCondition',
  availability: ({ availability }) =>
    availability === 'available'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  seller: ({ seller }) => ({
    identifier: seller,
  }),
  price: ({ sellingPrice }) => sellingPrice / 1e2, // TODO add spot price calculation
  sellingPrice: ({ sellingPrice }) => sellingPrice / 1e2,
  listPrice: ({ listPrice }) => listPrice / 1e2,
}
