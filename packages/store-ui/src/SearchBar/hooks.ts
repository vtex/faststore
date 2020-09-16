import { createContext, useContext, useEffect } from 'react'

export interface ISearchContext {
  term: string | null
  setTerm: ((t: string) => unknown) & { clear: () => void }
  onSearch: (term: string) => unknown
}

export const SearchBarContext = createContext<ISearchContext>(undefined as any)

export const useSearchBarContext = () => {
  const context = useContext(SearchBarContext)

  useEffect(() => {
    return () => context.setTerm.clear()
  }, [])

  return context
}
