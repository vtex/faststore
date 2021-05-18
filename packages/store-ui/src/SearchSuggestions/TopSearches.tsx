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
  items: Array<{ key: string; term: string }> | undefined
  variant?: string
}

const SearchSuggestionsTopSearches: FC<Required<Props>> = ({
  variant,
  items,
}) => {
  const {
    searchBar: { onSearch },
  } = useSearchSuggestions()

  return (
    <SearchSuggestionsList items={items} variant={variant}>
      {({ item: { term }, index, variant: v }) => (
        <Box variant={v} onClick={() => onSearch(term)}>
          <span>{++index}&deg;</span> {term}
        </Box>
      )}
    </SearchSuggestionsList>
  )
}

const SearchSuggestions: FC<Props> = ({ variant = 'topSearches', items }) => (
  <SearchSuggestionsContainer variant={variant} fallback={null}>
    <SearchSuggestionsTitle variant={variant}>
      <FormattedMessage id="suggestions.topSearches.title" />
    </SearchSuggestionsTitle>

    {items != null &&
      (items.length === 0 ? (
        <Center>
          <FormattedMessage id="suggestions.topSearches.empty" />
        </Center>
      ) : (
        <SearchSuggestionsTopSearches variant={variant} items={items} />
      ))}
  </SearchSuggestionsContainer>
)

export default SearchSuggestions
