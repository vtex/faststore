import { useLocation } from '@reach/router'
import { useMemo } from 'react'

import type { SearchPageQueryQueryVariables } from '../../templates/__generated__/SearchPageQuery.graphql'

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

    const query = pageContext.query ?? trimQuery(pathname)
    const querySegments = query.split('/')

    const map =
      pageContext.map ?? // in case of static generation
      params.get('map') ?? // user is navigating or entering directely into the page
      (querySegments.length === 1 && 'ft') // full text search by directly typing the search into searchbar

    const mapSegments = map !== false && map.split(',')

    // Test if no map could be generated for this path. This means that the path
    // was not pre rendered and the ?map querystring is mismatching the path
    if (
      map === false ||
      mapSegments === false ||
      mapSegments.length !== querySegments.length
    ) {
      throw new Error('NotFound')
    }

    const fullText = mapSegments[0] === 'ft' ? querySegments[0] : undefined
    const orderBy = params.get('orderBy') ?? pageContext.orderBy ?? ''
    const selectedFacets =
      pageContext.selectedFacets ??
      mapSegments.map((key, i) => ({ key, value: querySegments[i] }))

    return {
      orderBy,
      selectedFacets,
      fullText,
      query,
      map,
    }
  }, [
    search,
    pageContext.query,
    pageContext.map,
    pageContext.orderBy,
    pageContext.selectedFacets,
    pathname,
  ])
}
