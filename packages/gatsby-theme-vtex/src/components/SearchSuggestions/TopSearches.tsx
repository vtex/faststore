import {
  Box,
  SearchSuggestionsList,
  SearchSuggestionsListTitle,
  useSearchSuggestionsContext,
  SearchSuggestionsListContainer,
} from '@vtex/store-ui'
import React, { FC } from 'react'

import { useTopSearches } from '../../sdk/searchSuggestions/useTopSearches'

interface Props {
  variant?: string
  title: string
}

const SearchSuggestionsTopSearches: FC<Props> = ({
  title,
  variant = 'topSearches',
}) => {
  const { onSearch } = useSearchSuggestionsContext()
  const { data, error, isValidating } = useTopSearches()
  const searches = data?.vtex.topSearches?.searches

  if (error || !searches || (searches.length === 0 && isValidating)) {
    return <SearchSuggestionsListContainer variant={variant} />
  }

  return (
    <SearchSuggestionsListContainer variant={variant}>
      <SearchSuggestionsListTitle variant={variant} title={title} />
      <SearchSuggestionsList items={searches as any} variant={variant}>
        {({ item: { term }, index, variant: v }: any) => (
          <Box variant={v} onClick={() => onSearch(term)}>
            <span>{index}&deg;</span> {term}
          </Box>
        )}
      </SearchSuggestionsList>
    </SearchSuggestionsListContainer>
  )
}

export default SearchSuggestionsTopSearches
