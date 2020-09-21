import React, { FC } from 'react'

import { useSearchSuggestionsContext } from './base/hooks'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsTopSearches from './TopSearches'

const SearchSuggestions: FC = () => {
  const { term } = useSearchSuggestionsContext()

  if (term) {
    return <SearchSuggestionsProduct maxItems={2} />
  }

  return <SearchSuggestionsTopSearches />
}

export default SearchSuggestions
