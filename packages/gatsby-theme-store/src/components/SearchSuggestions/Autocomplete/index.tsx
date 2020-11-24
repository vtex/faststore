import React, { FC } from 'react'
import { Box, Center } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import { useAutocompleteSearchSeggestions } from './hooks'
import { SearchSuggestionsListContainer } from '../base/Container'
import { SearchSuggestionsListTitle } from '../base/Title'
import { SearchSuggestionsList } from '../base/List'
import { toRequiredItem } from '../base/hooks'

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
            defaultMessage: 'Suggestions',
          })}
        />
        <Center>
          {formatMessage({
            id: 'suggestions.autocomplete.notFound',
            defaultMessage: 'No suggestions',
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
          defaultMessage: 'Suggestions',
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
