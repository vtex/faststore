import { createContext, useContext } from 'react'

import { ISearchContext } from '../../SearchBar/hooks'

export interface ISuggestionsContext {
  searchBar: ISearchContext
  setTerm: (t: string) => unknown
  term: string
}

export const SearchSuggestionsContext = createContext<ISuggestionsContext>(
  undefined as any
)

export const useSearchSuggestionsContext = () =>
  useContext(SearchSuggestionsContext)

export const toRequiredItem = <T extends any>(x: Array<Maybe<T>>) => x as T[]
