import { SDKError } from '../utils/error'
import { initialize, reducer } from './useSearchState'
import type { State as SearchState, SearchSort } from './useSearchState'

export const format = (params: SearchState): URL => {
  const map: string[] = []
  const query: string[] = []

  if (params.term !== null) {
    map.push('term')
    query.push(params.term)
  }

  for (const facet of params.selectedFacets) {
    map.push(facet.key)
    query.push(facet.value)
  }

  map.push('sort')
  query.push(params.sort)

  if (typeof params.page === 'number') {
    map.push('page')
    query.push(params.page.toString())
  }

  const url = new URL(`${params.base}${query.join('/')}`, 'http://localhost')

  url.searchParams.set('map', map.join(','))

  return url
}

export const parse = ({ pathname, searchParams }: URL): SearchState => {
  const spath = pathname.split('/').slice(1)
  const smap = searchParams.get('map')?.split(',')

  if (smap === undefined) {
    throw new SDKError(
      `Cannot parse selected facets from window.location. Please add a 'map' querystring to the page`
    )
  }

  if (smap.length > spath.length) {
    throw new SDKError(
      `Invalid map querystring. There are more map params than segments on the path: (map: ${smap.join(
        ','
      )}, pathname: ${pathname}). `
    )
  }

  const nfacets = smap.length
  const offset = spath.length - nfacets
  let state = initialize({
    base: `/${spath.slice(0, offset).join('/')}`,
  })

  for (let it = 0; it < nfacets; it++) {
    const key = smap[it]
    const value = spath[it + offset]
    const action =
      key === 'sort'
        ? {
            type: 'setSort' as const,
            payload: value as SearchSort,
          }
        : key === 'term'
        ? {
            type: 'setTerm' as const,
            payload: value,
          }
        : key === 'page'
        ? {
            type: 'setPage' as const,
            payload: Number(value),
          }
        : {
            type: 'setFacet' as const,
            payload: { facet: { key, value }, unique: false },
          }

    state = reducer(state, action)
  }

  return state
}
