import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import type { SearchPageQueryQueryVariables } from '../../templates/__generated__/SearchPageQuery.graphql'

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
  const { search, pathname } = location

  return useMemo(() => {
    const params = new URLSearchParams(search)
    let query = pageContext.query!
    let map = pageContext.map!
    const priceRange = params.get('priceRange')
    let selectedFacets = pageContext.selectedFacets! as Array<{
      key: string
      value: string
    }>

    if (pageContext.staticPath === false) {
      query = trimQuery(pathname)
      map = params.get('map') ?? createMap(query)
      selectedFacets = selectedFacetsAfterQueryAndMap(query, map)
    }

    if (priceRange !== null && selectedFacets) {
      const priceRangeIndex = selectedFacets.findIndex(
        (facet) => facet.key === 'priceRange'
      )

      if (priceRangeIndex > -1) {
        selectedFacets[priceRangeIndex].value = priceRange
      } else {
        selectedFacets.push({
          key: 'priceRange',
          value: priceRange,
        })
      }
    }

    const fullText = map.startsWith('ft') ? query.split('/')[0] : undefined
    const orderBy = params.get('orderBy') ?? pageContext.orderBy ?? ''

    return {
      orderBy,
      selectedFacets,
      fullText,
      priceRange,
      query,
      map,
    }
  }, [
    search,
    pageContext.staticPath,
    pageContext.query,
    pageContext.map,
    pageContext.orderBy,
    pageContext.selectedFacets,
    pathname,
  ])
}
