import type { Resolver } from '..'
import type { StoreRegion as Root } from '../clients/commerce/types/StoreRegion'

export const Region: Record<string, Resolver<Root>> = {
  id: ({ id }) => id,
}
