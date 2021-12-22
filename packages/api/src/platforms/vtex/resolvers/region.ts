import type { Resolver } from '..'
import type { Region as Root } from '../clients/commerce/types/Region'

export const Region: Record<string, Resolver<Root>> = {
  id: ({ id }) => id,
}
