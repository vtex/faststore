import { initialize, reducer } from './useSearchState'
import type { State as SearchState, SearchSort } from './useSearchState'

export const format = (params: SearchState): URL => {
  const url = new URL(params.base, 'http://localhost')
  const { page, selectedFacets, sort, term } = params

  if (term !== null) {
    url.searchParams.set('q', term)
  }

  const facets = new Set<string>()

  for (const facet of selectedFacets) {
    url.searchParams.append(facet.key, facet.value)
    facets.add(facet.key)
  }

  if (selectedFacets.length > 0) {
    url.searchParams.set('facets', Array.from(facets).join(','))
  }

  url.searchParams.set('sort', sort)
  url.searchParams.set('page', page.toString())

  return url
}

export const parse = ({ pathname, searchParams }: URL): SearchState => {
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
