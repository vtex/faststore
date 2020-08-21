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
const createMap = (pathname: string) =>
  new Array(pathname.split('/').length).fill('c').join(',')

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

    return {
      query,
      map: pageContext?.map ?? params.get('map') ?? createMap(query),
      orderBy:
        pageContext?.orderBy ??
        params.get('orderBy') ??
        SearchFilterDefaults.orderBy,
    }
  }, [pageContext, location])
}
