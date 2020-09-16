import {
  Box,
  SearchSuggestionsList,
  useSearchSuggestionsContext,
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
    return <Box variant={`suggestions.${variant}`} />
  }

  return (
    <SearchSuggestionsList items={searches} variant={variant} title={title}>
      {({ item, index, variant: v }) => (
        <Box
          as="li"
          variant={v}
          key={`${item!.term}${index}`}
          onClick={() => onSearch(item!.term)}
        >
          <span>{index}&deg;</span> {item!.term}
        </Box>
      )}
    </SearchSuggestionsList>
  )
}

export default SearchSuggestionsTopSearches
