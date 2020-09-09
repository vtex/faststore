import React, { createContext, FC } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'

export interface SearchFilters {
  query: Maybe<string>
  map: Maybe<string>
  orderBy: Maybe<string>
}

interface SearchContextType {
  data: SearchPageQueryQuery
  filters: SearchFilters
}

export const SearchContext = createContext<SearchContextType>(undefined as any)

SearchContext.displayName = 'SearchContext'

export const SearchProvider: FC<SearchContextType> = ({
  children,
  filters,
  data,
}) => (
  <SearchContext.Provider value={{ filters, data }}>
    {children}
  </SearchContext.Provider>
)
