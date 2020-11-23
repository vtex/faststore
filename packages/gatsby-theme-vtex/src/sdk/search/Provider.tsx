import React, { createContext, FC } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'
import { useSearchFiltersFromPageContext } from './useSearchFiltersFromPageContext'

export type SearchFilters = ReturnType<typeof useSearchFiltersFromPageContext>

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
