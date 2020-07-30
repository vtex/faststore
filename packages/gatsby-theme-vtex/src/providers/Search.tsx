import React, { createContext, FC, useContext, useState } from 'react'
import { Product } from '@vtex/gatsby-source-vtex'

export interface SearchOptions {
  query?: string
  map?: string
}

type SetFilterFn = (opts: SearchOptions) => SearchOptions

interface Context {
  filters: SearchOptions
  setFilters: (opts: SearchOptions | SetFilterFn) => void
  initialData: Product[] | undefined
}

const SearchFilterContext = createContext<Context>(null as any)

SearchFilterContext.displayName = 'SearchFilterContext'

interface Props {
  initialOptions?: SearchOptions
  initialData?: Product[]
}

const SearchProvider: FC<Props> = ({
  children,
  initialOptions,
  initialData: staticInitialData,
}) => {
  const [filters, setFiltersState] = useState<SearchOptions>(
    initialOptions ?? {}
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
