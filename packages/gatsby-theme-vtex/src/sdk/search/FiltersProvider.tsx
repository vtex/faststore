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
// TODO: this function may have to change in the future
const createMap = (pathname: string) =>
  new Array(pathname.split('/').length).fill('c').join(',')

export const SearchFiltersProvider: FC<Props> = ({ children, filters }) => {
  const { search, pathname } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const value = {
    query: filters?.query ?? pathname.slice(1, pathname.length),
    map: filters?.map ?? params.get('map') ?? createMap(pathname),
    orderBy: filters?.orderBy ?? params.get('orderBy') ?? DEFAULT_ORDER_BY,
  }

  return (
    <SearchFilterContext.Provider value={value}>
      {children}
    </SearchFilterContext.Provider>
  )
}
