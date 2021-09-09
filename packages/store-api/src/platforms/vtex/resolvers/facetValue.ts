import type { Resolver } from '..'
import type { Value } from '../clients/search/types/AttributeSearchResult'

type Root = Value

export const StoreFacetValue: Record<string, Resolver<Root>> = {
  value: ({ key, from, to }) => key ?? `${from}-to-${to}`,
  label: ({ label }) => label ?? 'unknown',
  selected: ({ active }) => active,
  quantity: ({ count }) => count,
}
