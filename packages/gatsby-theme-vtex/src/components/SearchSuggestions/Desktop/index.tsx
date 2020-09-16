import {
  SearchSuggestions as SearchSuggestionsProvider,
  useSearchBarContext,
} from '@vtex/store-ui'
import React, { FC } from 'react'

import SearchSuggestionsAutocomplete from './Autocomplete'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsHistory from './SearchHistory'
import SearchSuggestionsTopSearches from '../TopSearches'

const SearchSuggestions: FC = () => {
  const { term } = useSearchBarContext()

  return (
    <SearchSuggestionsProvider>
      {term ? (
        <>
          <SearchSuggestionsAutocomplete title="Suggestions" />
          <SearchSuggestionsProduct
            title="Products For"
            countDesc={(count: number) => `See all ${count} items`}
            maxItems={3}
          />
        </>
      ) : (
        <>
          <SearchSuggestionsTopSearches title="Top Searches" />
          <SearchSuggestionsHistory title="History" />
        </>
      )}
    </SearchSuggestionsProvider>
  )
}

export default SearchSuggestions
