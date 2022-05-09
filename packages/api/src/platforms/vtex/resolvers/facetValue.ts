import type { Resolver } from '..'
import type { FacetValue } from '../clients/search/types/FacetSearchResult'

type Root = FacetValue

export const StoreFacetValue: Record<string, Resolver<Root>> = {
  value: ({ value, range }) =>
    value ?? `${range?.from ?? ''}-to-${range?.to ?? ''}`,
  label: ({ name }) => name || 'unknown',
  selected: ({ selected }) => selected,
  quantity: ({ quantity }) => quantity,
}
