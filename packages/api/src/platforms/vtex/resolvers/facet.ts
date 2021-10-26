import type { Resolver } from '..'
import type { Attribute } from '../clients/search/types/AttributeSearchResult'

type Root = Attribute

export const StoreFacet: Record<string, Resolver<Root>> = {
  key: ({ key }) => key,
  label: ({ label }) => label,
  values: ({ values }) => values,
  type: ({ type }) => (type === 'text' ? 'BOOLEAN' : 'RANGE'),
}
