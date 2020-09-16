import { createContext, useContext } from 'react'

export interface ISearchContext {
  syncTerm: string // Synchronous term. This can have a huge negative impact in performance
  asyncTerm: string // The Asynchronous/throttled term. This should be safe to use for reading input value
  setTerm: (t: string) => unknown
  onSearch: (term: string) => unknown
}

export const SearchBarContext = createContext<ISearchContext>(undefined as any)

export const useSearchBarContext = () => useContext(SearchBarContext)
