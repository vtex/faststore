import type { SearchSort, State } from './types'
import { initialize, reducer } from './useSearchState'

export const parse = ({ pathname, searchParams }: URL): State => {
  let state = initialize({
    base: pathname,
    term: searchParams.get('q') ?? null,
    sort: (searchParams.get('sort') as SearchSort) ?? undefined,
    page: Number(searchParams.get('page') ?? 0),
  })

  const facets = searchParams.get('facets')?.split(',') ?? []

  for (const facet of facets) {
    const values = searchParams.getAll(facet)

    for (const value of values) {
      state = reducer(state, {
        type: 'setFacet' as const,
        payload: { facet: { key: facet, value }, unique: false },
      })
    }
  }

  return state
}
