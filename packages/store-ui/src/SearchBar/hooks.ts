import { createContext, useContext } from 'react'

export interface ISearchContext {
  term: string | null
  setTerm: (t: string) => unknown
  onSearch: (term: string) => unknown
}

export const SearchBarContext = createContext<ISearchContext>(undefined as any)

export const useSearchBarContext = () => useContext(SearchBarContext)
