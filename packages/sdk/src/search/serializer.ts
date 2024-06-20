import { SDKError } from '../utils/error'
import { isSearchSort, setFacet } from './facets'
import { initialize } from './useSearchState'
import type { SearchSort, State } from '../types'

function getPassThroughSearchParams(params: URLSearchParams, denyList: String[]) {
  const passthroughParams = new URLSearchParams()

  for (const [key, value] of params.entries()) {
    if (!denyList.includes(key)) {
      passthroughParams.append(key, value)
    }
  }

  return passthroughParams
}

export const parse = ({ pathname, searchParams }: URL): State => {
  const state = initialize({
    base: pathname,
    term: searchParams.get('q') ?? null,
    sort: (searchParams.get('sort') as SearchSort) ?? undefined,
    page: Number(searchParams.get('page') ?? 0),
  })

  if (!isSearchSort(state.sort)) {
    throw new SDKError(`Uknown sorting option ${state.sort}`)
  }

  const facets = searchParams.get('facets')?.split(',') ?? []

  for (const facet of facets) {
    const values = searchParams.getAll(facet)

    for (const value of values) {
      state.selectedFacets = setFacet(state.selectedFacets, {
        key: facet,
        value,
      })
    }
  }

  state.passThrough = getPassThroughSearchParams(searchParams, [
    'q',
    'sort',
    'page',
    'facets',
    ...facets,
  ])

  return state
}
