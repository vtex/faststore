import React, { createContext, FC, useMemo } from 'react'
import { useLocation } from '@reach/router'

import { Maybe } from '../../typings'
import { SearchFilterDefaults } from './defaults'
import {
  SearchPageQueryQueryVariables,
  SearchPageQueryQuery,
} from '../../templates/__generated__/SearchPageQuery.graphql'
import { isServer } from '../../utils/env'

export interface SearchFilters {
  query: Maybe<string>
  map: Maybe<string>
  orderBy: Maybe<string>
}

export interface SearchContext {
  filters: SearchFilters
  staticData: SearchPageQueryQuery | undefined
}

export const SearchContext = createContext<SearchContext>(undefined as any)

SearchContext.displayName = 'SearchContext'

interface Props {
  pageContext: SearchPageQueryQueryVariables
  pageData: SearchPageQueryQuery | undefined
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

const shouldUseStaticData = (
  {
    map,
    query,
    staticPath,
    orderBy = SearchFilterDefaults.orderBy,
  }: SearchPageQueryQueryVariables,
  filters: SearchFilters
) => {
  if (!staticPath) {
    return false
  }

  return (
    isServer ||
    (query === filters.query &&
      orderBy === filters.orderBy &&
      map === filters.map)
  )
}

export const SearchProvider: FC<Props> = ({
  children,
  pageContext: { map, orderBy },
  pageContext,
  pageData,
}) => {
  const { search, pathname } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const query = trimQuery(pathname)

  const filters = {
    query,
    map: params.get('map') ?? map ?? createMap(query),
    orderBy: params.get('orderBy') ?? orderBy ?? SearchFilterDefaults.orderBy,
  }

  const staticData = shouldUseStaticData(pageContext, filters)
    ? pageData
    : undefined

  return (
    <SearchContext.Provider value={{ filters, staticData }}>
      {children}
    </SearchContext.Provider>
  )
}
