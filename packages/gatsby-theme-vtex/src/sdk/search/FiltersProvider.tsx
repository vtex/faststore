import React, { createContext, FC, useMemo } from 'react'
import { useLocation } from '@reach/router'

import { Maybe } from '../../typings'

export interface SearchFilters {
  query: Maybe<string>
  map: Maybe<string>
  orderBy: Maybe<string>
}

export const DEFAULT_ORDER_BY = 'OrderByScoreDESC'

export const SearchFilterContext = createContext<SearchFilters>(
  undefined as any
)

SearchFilterContext.displayName = 'SearchFilterContext'

interface Props {
  filters?: SearchFilters
}

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

export const SearchFiltersProvider: FC<Props> = ({ children, filters }) => {
  const { search, pathname } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const query = filters?.query ?? trimQuery(pathname)

  const value = {
    query,
    map: filters?.map ?? params.get('map') ?? createMap(query),
    orderBy: filters?.orderBy ?? params.get('orderBy') ?? DEFAULT_ORDER_BY,
  }

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  )
}
