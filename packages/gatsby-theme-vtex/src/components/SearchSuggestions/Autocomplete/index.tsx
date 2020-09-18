import React, { FC, Suspense } from 'react'
import { Box } from '@vtex/store-ui'

import { useAutocompleteSearchSeggestions } from './hooks'
import { SearchSuggestionsListContainer } from '../base/Container'
import { SearchSuggestionsListTitle } from '../base/Title'
import { SearchSuggestionsList } from '../base/List'
import { toRequiredItem } from '../base/hooks'

interface Props {
  title: string
  variant?: string
}

const SearchSuggestionsAutocomplete: FC<Required<Props>> = ({
  title,
  variant,
}) => {
  const {
    query: { data, error },
    setTerm,
    onSearch,
  } = useAutocompleteSearchSeggestions()

  const searches = data?.vtex.autocompleteSearchSuggestions?.searches

  if (error || !searches || searches.length === 0) {
    return null
  }

  const items = toRequiredItem(searches)

  return (
    <>
      <SearchSuggestionsListTitle variant={variant} title={title} />
      <SearchSuggestionsList items={items} variant={variant}>
        {({ item: { term }, variant: v }) => (
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
    </>
  )
}

const SearchSuggestions: FC<Props> = ({ variant = 'autocomplete', title }) => (
  <SearchSuggestionsListContainer variant={variant}>
    <Suspense fallback={null}>
      <SearchSuggestionsAutocomplete title={title} variant={variant} />
    </Suspense>
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
