import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import { SearchPageQueryQueryVariables } from '../../templates/__generated__/SearchPageQuery.graphql'
import { SearchFilterDefaults } from './defaults'

// Creates a string with as many `c,c` as pathname has
// segments.
// For instance: cozinha/faqueiro-e-talheres would
// generate the string c,c
//
// TODO: this function may have to change in the future
const createMap = (query: string) => {
  const splitted = query.split('/')

  // We have generated all departments/brands statically, so it's safe
  // to assume that, if the process reach this code, the path
  // is a full text search
  if (splitted.length === 1) {
    return 'ft'
  }

  return new Array(splitted.length).fill('c').join(',')
}

// I think this function should change to a more simpler version.
const selectedFacetsAfterQueryAndMap = (query: string, map: string) => {
  const smap = map.split(',')
  const squery = query.split('/')

  const selectedFacets: Array<{ key: string; value: string }> = []

  for (let it = 0; it < smap.length; it++) {
    selectedFacets.push({ key: smap[it], value: squery[it] })
  }

  return selectedFacets
}

// Removes starting/ending slashes
// ex: trimQuery('/p0/p1/') -> 'p0/p1'
//
// Slice is done only once to improve performance !
//
// TODO: This function should be removed eventually
const trimQuery = (query: string) => {
  const i = query[0] === '/' ? 1 : 0
  const j = query[query.length - 1] === '/' ? query.length - 1 : query.length

  return query.slice(i, j)
}

export const useSearchFiltersFromPageContext = (
  pageContext: SearchPageQueryQueryVariables
) => {
  const location = useLocation()

  return useMemo(() => {
    const { search, pathname } = location
    const params = new URLSearchParams(search)
    const query = pageContext?.query ?? trimQuery(pathname)
    const map = pageContext?.map ?? params.get('map') ?? createMap(query)
    const selectedFacets =
      pageContext?.selectedFacets ?? selectedFacetsAfterQueryAndMap(query, map)

    const fullText = map.startsWith('ft') ? query.split('/')[0] : undefined

    const orderBy =
      pageContext?.orderBy ??
      params.get('orderBy') ??
      SearchFilterDefaults.orderBy

    return {
      orderBy,
      selectedFacets,
      fullText,
      query,
      map,
    }
  }, [pageContext, location])
}
