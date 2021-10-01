import type { EnhancedSku } from '../utils/enhanceSku'
import type { Resolver } from '..'
import type { Item } from '../clients/commerce/types/Simulation'
import type { OrderFormItem } from '../clients/commerce/types/OrderForm'

type Root =
  | (Item & { product: EnhancedSku }) // when querying search/product
  | (OrderFormItem & { product: Promise<EnhancedSku> }) // when querying order

export const StoreOffer: Record<string, Resolver<Root>> = {
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
  itemOffered: ({ product }) => product,
  quantity: ({ quantity }) => quantity,
}
