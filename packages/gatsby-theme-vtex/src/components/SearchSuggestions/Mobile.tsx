import React, { FC } from 'react'

import { useSearchSuggestionsContext } from './base/hooks'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsTopSearches from './TopSearches'

const SearchSuggestions: FC = () => {
  const { term } = useSearchSuggestionsContext()

  if (term.length === 0) {
    return <SearchSuggestionsTopSearches />
  }

  return term ? <SearchSuggestionsProduct maxItems={2} term={term} /> : null
}

export default SearchSuggestions
