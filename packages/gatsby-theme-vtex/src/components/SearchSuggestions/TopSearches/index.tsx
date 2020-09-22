import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Center } from '@vtex/store-ui'
import React, { FC } from 'react'

import { SearchSuggestionsListContainer } from '../base/Container'
import { toRequiredItem } from '../base/hooks'
import { SearchSuggestionsList } from '../base/List'
import { SearchSuggestionsListTitle } from '../base/Title'
import { useTopSearches } from './hooks'

interface Props {
  variant?: string
}

const SearchSuggestionsTopSearches: FC<Required<Props>> = ({ variant }) => {
  const { formatMessage } = useIntl()
  const {
    query: { data, error },
    searchBar: { onSearch },
  } = useTopSearches()

  const searches = data?.vtex.topSearches?.searches
  const items = searches && toRequiredItem(searches)
  const title = formatMessage({
    id: 'suggestions.topSearches.title',
    defaultMessage: 'Top Searches',
  })

  if (error || !searches) {
    return null
  }

  if (searches.length === 0) {
    return (
      <>
        <SearchSuggestionsListTitle variant={variant} title={title} />
        <Center>
          {formatMessage({
            id: 'suggestions.topSearches.empty',
            defaultMessage: 'Type to search',
          })}
        </Center>
      </>
    )
  }

  return (
    <>
      <SearchSuggestionsListTitle variant={variant} title={title} />
      <SearchSuggestionsList items={items} variant={variant}>
        {({ item: { term }, index, variant: v }) => (
          <Box variant={v} onClick={() => onSearch(term)}>
            <span>{++index}&deg;</span> {term}
          </Box>
        )}
      </SearchSuggestionsList>
    </>
  )
}

const SearchSuggestions: FC<Props> = ({ variant = 'topSearches' }) => (
  <SearchSuggestionsListContainer variant={variant} fallback={null}>
    <SearchSuggestionsTopSearches variant={variant} />
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
