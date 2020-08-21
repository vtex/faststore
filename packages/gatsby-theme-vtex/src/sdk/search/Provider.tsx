import React, { createContext, FC } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'

export interface SearchFilters {
  query: Maybe<string>
  map: Maybe<string>
  orderBy: Maybe<string>
}

interface SearchContext {
  data: SearchPageQueryQuery
  filters: SearchFilters
}

export const SearchContext = createContext<SearchContext>(undefined as any)

SearchContext.displayName = 'SearchContext'

type Props = SearchContext

export const SearchProvider: FC<Props> = ({ children, filters, data }) => (
  <SearchContext.Provider value={{ filters, data }}>
    {children}
  </SearchContext.Provider>
)
