import React, { createContext } from 'react'
import type { FC } from 'react'

import type { useSearchFiltersFromPageContext } from './useSearchFiltersFromPageContext'

export type SearchFilters = ReturnType<typeof useSearchFiltersFromPageContext>

interface SearchContextType {
  data: any
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
