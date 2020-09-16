import { useSearchBarContext } from '@vtex/store-ui'
import { createContext, useContext, useEffect } from 'react'

export interface ISuggestionsContext {
  setTerm: (t: string | null) => unknown
  term: string | null
}

export const SearchSuggestionsContext = createContext<ISuggestionsContext>(
  undefined as any
)

export const useSearchSuggestionsContext = () => {
  const { term, setTerm } = useContext(SearchSuggestionsContext)
  const { term: searchbarTerm, onSearch } = useSearchBarContext()

  useEffect(() => {
    setTerm(searchbarTerm)
  }, [searchbarTerm])

  return {
    term,
    searchbarTerm,
    setTerm,
    onSearch,
  }
}
