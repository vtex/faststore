import { createContext, useContext } from 'react'

interface ISearchContext {
  term: string
  setTerm: (t: string) => unknown
}

export const SearchBarContext = createContext<ISearchContext>(undefined as any)

export const useSearchBarContext = () => useContext(SearchBarContext)
