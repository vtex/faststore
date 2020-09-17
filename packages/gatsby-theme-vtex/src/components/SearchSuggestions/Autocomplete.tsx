import React, { FC } from 'react'
import {
  Box,
  SearchSuggestionsList,
  SearchSuggestionsListTitle,
  useSearchSuggestionsContext,
  SearchSuggestionsListContainer,
} from '@vtex/store-ui'

import { useAutocompleteSearchSeggestions } from '../../sdk/searchSuggestions/useAutocomplete'

interface Props {
  title: string
  variant?: string
}

const SearchSuggestionsAutocomplete: FC<Props> = ({
  title,
  variant = 'autocomplete',
}) => {
  const { searchbarTerm, setTerm, onSearch } = useSearchSuggestionsContext()
  const { data, error, isValidating } = useAutocompleteSearchSeggestions(
    searchbarTerm!
  )

  const searches = data?.vtex.autocompleteSearchSuggestions?.searches

  if (error || (!searches && isValidating)) {
    return <SearchSuggestionsListContainer variant={variant} />
  }

  return (
    <SearchSuggestionsListContainer variant={variant}>
      <SearchSuggestionsListTitle variant={variant} title={title} />
      <SearchSuggestionsList items={searches as any} variant={variant}>
        {({ item: { term }, variant: v }: any) => (
          <Box
            as="span"
            variant={v}
            onClick={() => onSearch(term)}
            onMouseEnter={() => setTerm(term)}
          >
            {term}
          </Box>
        )}
      </SearchSuggestionsList>
    </SearchSuggestionsListContainer>
  )
}

export default SearchSuggestionsAutocomplete
