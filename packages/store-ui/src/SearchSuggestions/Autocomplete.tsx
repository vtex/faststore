import { FormattedMessage } from 'react-intl'
import React from 'react'
import { Box } from 'theme-ui'
import type { FC } from 'react'

import Center from '../Center'
import SearchSuggestionsContainer from './base/Container'
import SearchSuggestionsList from './base/List'
import SearchSuggestionsTitle from './base/Title'
import { useSearchSuggestions } from './base/useSearchSuggestions'

interface Props {
  items?: Array<{ term: string; key: string }>
  variant?: string
}

const SearchSuggestionsAutocomplete: FC<Required<Props>> = ({
  variant,
  items: suggestions,
}) => {
  const {
    setTerm,
    searchBar: { onSearch },
  } = useSearchSuggestions()

  return (
    <SearchSuggestionsList items={suggestions} variant={variant}>
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
  )
}

const SearchSuggestions: FC<Props> = ({
  variant = 'autocomplete',
  items: suggestions,
}) => (
  <SearchSuggestionsContainer variant={variant} fallback={null}>
    <SearchSuggestionsTitle variant={variant}>
      <FormattedMessage id="suggestions.autocomplete.title" />
    </SearchSuggestionsTitle>

    {suggestions != null &&
      (suggestions.length === 0 ? (
        <Center>
          <FormattedMessage id="suggestions.autocomplete.notFound" />
        </Center>
      ) : (
        <SearchSuggestionsAutocomplete variant={variant} items={suggestions} />
      ))}
  </SearchSuggestionsContainer>
)

export default SearchSuggestions
