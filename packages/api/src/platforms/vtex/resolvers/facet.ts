import type { Resolver } from '..'
import type { Facet } from '../clients/search/types/FacetSearchResult'

type Root = Facet

export const StoreFacet: Record<string, Resolver<Root>> = {
  // TODO: get the key value from Facet object.
  key: ({ values }) => values[0]?.key,
  label: ({ name }) => name ?? 'unknown',
  values: ({ values }) => values,
  type: ({ type }) => (type === 'TEXT' ? 'BOOLEAN' : 'RANGE'),
}
