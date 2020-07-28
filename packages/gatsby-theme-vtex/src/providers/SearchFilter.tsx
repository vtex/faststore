import React, { createContext, FC, useContext, useState } from 'react'

export interface SearchOptions {
  query?: string
  map?: string
}

type Context = [
  SearchOptions,
  React.Dispatch<React.SetStateAction<SearchOptions>>
]

const SearchFilterContext = createContext<Context>(null as any)

SearchFilterContext.displayName = 'SearchFilterContext'

interface Props {
  initialOptions?: SearchOptions
}

const SearchFilterProvider: FC<Props> = ({ children, initialOptions }) => {
  const [filters, setFilters] = useState<SearchOptions>(initialOptions ?? {})

  return (
    <SearchFilterContext.Provider value={[filters, setFilters]}>
      {children}
    </SearchFilterContext.Provider>
  )
}

export const useSearchFilters = () => useContext(SearchFilterContext)

export default SearchFilterProvider
