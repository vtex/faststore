import React, { createContext, FC, useContext, useState } from 'react'

import { SearchQueryQuery } from '../components/Search/__generated__/SearchQuery.graphql'

export interface SearchOptions {
  query: string | null | undefined
  map: string | null | undefined
}

type SetFilterFn = (opts: SearchOptions) => SearchOptions

interface Context {
  filters: SearchOptions
  setFilters: (opts: SearchOptions | SetFilterFn) => void
  initialData?: SearchQueryQuery
}

const SearchFilterContext = createContext<Context>(null as any)

SearchFilterContext.displayName = 'SearchFilterContext'

interface Props {
  initialOptions?: SearchOptions
  initialData?: SearchQueryQuery
}

const SearchProvider: FC<Props> = ({
  children,
  initialOptions,
  initialData: staticInitialData,
}) => {
  const [filters, setFiltersState] = useState<SearchOptions>(
    initialOptions ?? { query: undefined, map: undefined }
  )

  const [initialData, setInitialData] = useState(staticInitialData)

  const setFilters = (optionsOrFn: SearchOptions | SetFilterFn) => {
    setInitialData(undefined)
    setFiltersState(optionsOrFn)
  }

  return (
    <SearchFilterContext.Provider value={{ filters, setFilters, initialData }}>
      {children}
    </SearchFilterContext.Provider>
  )
}

export const useSearchFilters = () => useContext(SearchFilterContext)

export default SearchProvider
