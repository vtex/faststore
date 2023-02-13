import { formatSearchState, initSearchState } from '@faststore/sdk'
import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

export const formatSearchPath = (term: string) => {
  const { pathname, search } = formatSearchState(
    initSearchState({
      term,
      base: '/s',
    })
  )

  return `${pathname}${search}`
}

export interface SearchInputContextValue {
  onSearchInputSelection?: (term: string, path: string) => void
}

const SearchInputContext = createContext<SearchInputContextValue | null>(null)

export function SearchInputProvider({
  onSearchInputSelection,
  children,
}: PropsWithChildren<SearchInputContextValue>) {
  return (
    <SearchInputContext.Provider value={{ onSearchInputSelection }}>
      {children}
    </SearchInputContext.Provider>
  )
}

const useSearchInput = () => {
  const context = useContext(SearchInputContext)

  if (!context) {
    throw new Error('Do not use outside the SearchInputContext context.')
  }

  return context
}

export default useSearchInput
