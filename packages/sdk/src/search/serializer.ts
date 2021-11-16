import { setSearchParam } from './reducer'
import { initialize } from './state'
import type { SearchParamsState } from './state'

export const format = (params: SearchParamsState): URL => {
  const url = new URL(params.base, 'http://localhost')

  if (params.term !== null) {
    url.searchParams.set('term', params.term)
  }

  for (const facet of params.selectedFacets) {
    url.searchParams.append(facet.key, facet.value)
  }

  url.searchParams.set('sort', params.sort)

  if (typeof params.page === 'number') {
    url.searchParams.set('page', params.page.toString())
  }

  return url
}

export const parse = ({ pathname, searchParams }: URL): SearchParamsState => {
  let state = initialize({
    base: pathname,
  })

  searchParams.forEach((value, key) => {
    state = setSearchParam(state, { key, value, unique: false })
  })

  return state
}
