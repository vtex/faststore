import {
  SearchSuggestions as SearchSuggestionsProvider,
  useSearchBarContext,
} from '@vtex/store-ui'
import React, { FC } from 'react'

import SearchSuggestionsProduct from './Products'
import SearchSuggestionsTopSearches from '../TopSearches'

const SearchSuggestions: FC = () => {
  const { term } = useSearchBarContext()

  return (
    <SearchSuggestionsProvider>
      {term ? (
        <SearchSuggestionsProduct
          title="Products For"
          countDesc={(count: number) => `See all ${count} items`}
          maxItems={3}
        />
      ) : (
        <SearchSuggestionsTopSearches title="Top Searches" />
      )}
    </SearchSuggestionsProvider>
  )
}

export default SearchSuggestions
