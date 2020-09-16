import React, { FC } from 'react'
import {
  Box,
  SearchSuggestionsList,
  useSearchSuggestionsContext,
} from '@vtex/store-ui'

import { useAutocompleteSearchSeggestions } from '../../sdk/searchSuggestions/useAutocomplete'

interface Props {
  variant?: string
  title?: string
}

const SearchSuggestionsAutocomplete: FC<Props> = ({
  title,
  variant = 'autocomplete',
}) => {
  const { searchbarTerm, setTerm, onSearch } = useSearchSuggestionsContext()
  const { data, error } = useAutocompleteSearchSeggestions(searchbarTerm!)
  const searches = data?.vtex.autocompleteSearchSuggestions?.searches

  if (error || !searches) {
    return <Box variant={`suggestions.${variant}`} />
  }

  return (
    <SearchSuggestionsList items={searches} variant={variant} title={title}>
      {({ item, variant: v }) => (
        <li key={item!.term}>
          <Box
            as="span"
            variant={v}
            onClick={() => onSearch(item!.term)}
            onMouseEnter={() => setTerm(item!.term)}
            onMouseLeave={() => setTerm(searchbarTerm)}
          >
            {item!.term}
          </Box>
        </li>
      )}
    </SearchSuggestionsList>
  )
}

export default SearchSuggestionsAutocomplete
