import type { Resolver } from '..'
import type { FacetValueBoolean } from '../clients/search/types/FacetSearchResult'

export const StoreFacetValueBoolean: Record<
  string,
  Resolver<FacetValueBoolean>
> = {
  value: ({ value }) => value,
  label: ({ name }) => name || 'unknown',
  selected: ({ selected }) => selected,
  quantity: ({ quantity }) => quantity,
}
