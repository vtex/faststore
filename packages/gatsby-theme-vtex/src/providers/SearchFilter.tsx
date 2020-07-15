import { FilterOptions } from '@vtex/gatsby-source-vtex'
import React, { createContext, FC, useContext, useState } from 'react'

type Context = [
  FilterOptions,
  React.Dispatch<React.SetStateAction<FilterOptions>>
]

const SearchFilterContext = createContext<Context>(null as any)

SearchFilterContext.displayName = 'SearchFilterContext'

const SearchFilterProvider: FC = ({ children }) => {
  const [filters, setFilters] = useState<FilterOptions>({})

  return (
    <SearchFilterContext.Provider value={[filters, setFilters]}>
      {children}
    </SearchFilterContext.Provider>
  )
}

export const useSearchFilters = () => useContext(SearchFilterContext)

export default SearchFilterProvider
