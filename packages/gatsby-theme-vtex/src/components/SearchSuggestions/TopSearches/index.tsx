import { Box } from '@vtex/store-ui'
import React, { FC, Suspense } from 'react'

import { SearchSuggestionsListContainer } from '../base/Container'
import { toRequiredItem } from '../base/hooks'
import { SearchSuggestionsList } from '../base/List'
import { SearchSuggestionsListTitle } from '../base/Title'
import { useTopSearches } from './hooks'

interface Props {
  variant?: string
  title: string
}

const SearchSuggestionsTopSearches: FC<Required<Props>> = ({
  title,
  variant,
}) => {
  const {
    query: { data, error },
    onSearch,
  } = useTopSearches()

  const searches = data?.vtex.topSearches?.searches

  if (error || !searches || searches.length === 0) {
    return null
  }

  const items = toRequiredItem(searches)

  return (
    <>
      <SearchSuggestionsListTitle variant={variant} title={title} />
      <SearchSuggestionsList items={items} variant={variant}>
        {({ item: { term }, index, variant: v }) => (
          <Box variant={v} onClick={() => onSearch(term)}>
            <span>{index}&deg;</span> {term}
          </Box>
        )}
      </SearchSuggestionsList>
    </>
  )
}

const SearchSuggestions: FC<Props> = ({ variant = 'topSearches', title }) => (
  <SearchSuggestionsListContainer variant={variant}>
    <Suspense fallback={null}>
      <SearchSuggestionsTopSearches variant={variant} title={title} />
    </Suspense>
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
