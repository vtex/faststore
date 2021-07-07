import { SDKError } from '../utils/error'
import { setSearchParam } from './reducer'
import { initialize } from './state'
import type { SearchParamsState } from './state'

export const format = (params: SearchParamsState): URL => {
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

  if (params.personalized !== false) {
    map.push('personalized')
    query.push('per')
  }

  if (typeof params.page === 'number') {
    map.push('page')
    query.push(params.page.toString())
  }

  const url = new URL(
    `${params.base}${query.join('/')}`,
    window.location.origin
  )

  url.searchParams.set('map', map.join(','))

  return url
}

export const parse = ({ pathname, searchParams }: URL): SearchParamsState => {
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

    state = setSearchParam(state, { key, value, unique: false })
  }

  return state
}
