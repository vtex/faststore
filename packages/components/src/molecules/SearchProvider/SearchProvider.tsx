import React from 'react'
import type { PropsWithChildren } from 'react'
import { createContext } from 'react'

export interface SearchProviderContextValue {
  /**
   * Term to be researched.
   */
  term: string
  /**
   * Enables a loading state.
   */
  isLoading: boolean
  /**
   * List of Suggestion terms.
   */
  terms: Array<{ value: string }>
  /**
   * List of Suggested products.
   */
  products: {}[]
  /**
   * Callback function when a search term is selected.
   */
  onSearchSelection?: (term: string, path: string) => void
}

export const SearchContext = createContext<SearchProviderContextValue | null>(
  null
)

function SearchProvider({
  onSearchSelection,
  children,
  term,
  terms,
  products,
  isLoading,
}: PropsWithChildren<SearchProviderContextValue>) {
  return (
    <SearchContext.Provider
      value={{ onSearchSelection, term, terms, products, isLoading }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export default SearchProvider
