import React from 'react'
import type { FC } from 'react'

import SearchSuggestionsAutocomplete from './Autocomplete'
import { useSearchSuggestionsContext } from './base/hooks'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsHistory from './SearchHistory'
import SearchSuggestionsTopSearches from './TopSearches'

const SearchSuggestions: FC = () => {
  const {
    term,
    searchBar: { asyncTerm },
  } = useSearchSuggestionsContext()

  if (term.length === 0) {
    return (
      <>
        <SearchSuggestionsTopSearches />
        <SearchSuggestionsHistory />
      </>
    )
  }

  return (
    <>
      {asyncTerm ? <SearchSuggestionsAutocomplete term={asyncTerm} /> : null}
      {term ? <SearchSuggestionsProduct maxItems={3} term={term} /> : null}
    </>
  )
}

export default SearchSuggestions
