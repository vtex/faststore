import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Center } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import { SearchSuggestionsListContainer } from '../base/Container'
import { toRequiredItem } from '../base/hooks'
import { SearchSuggestionsList } from '../base/List'
import { SearchSuggestionsListTitle } from '../base/Title'
import { useAutocompleteSearchSeggestions } from './hooks'

interface Props {
  term: string
  variant?: string
}

const SearchSuggestionsAutocomplete: FC<Required<Props>> = ({
  variant,
  term: t,
}) => {
  const { formatMessage } = useIntl()
  const {
    query: { data, error },
    setTerm,
    searchBar: { onSearch },
  } = useAutocompleteSearchSeggestions({ term: t })

  const searches = data?.vtex.autocompleteSearchSuggestions?.searches
  const items = searches && toRequiredItem(searches)

  if (error || !searches) {
    return null
  }

  if (searches.length === 0) {
    return (
      <>
        <SearchSuggestionsListTitle
          variant={variant}
          title={formatMessage({
            id: 'suggestions.autocomplete.title',
          })}
        />
        <Center>
          {formatMessage({
            id: 'suggestions.autocomplete.notFound',
          })}
        </Center>
      </>
    )
  }

  return (
    <>
      <SearchSuggestionsListTitle
        variant={variant}
        title={formatMessage({
          id: 'suggestions.autocomplete.title',
        })}
      />
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

const SearchSuggestions: FC<Props> = ({ variant = 'autocomplete', term }) => (
  <SearchSuggestionsListContainer variant={variant} fallback={null}>
    <SearchSuggestionsAutocomplete variant={variant} term={term} />
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
