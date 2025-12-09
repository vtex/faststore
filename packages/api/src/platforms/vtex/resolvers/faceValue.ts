import type { GraphqlResolver } from '..'
import type { FacetValueBoolean } from '../clients/search/types/FacetSearchResult'

export const StoreFacetValueBoolean: Record<
  string,
  GraphqlResolver<FacetValueBoolean>
> = {
  value: ({ value }) => value,
  label: ({ name }) => name || 'unknown',
  selected: ({ selected }) => selected,
  quantity: ({ quantity }) => quantity,
}
