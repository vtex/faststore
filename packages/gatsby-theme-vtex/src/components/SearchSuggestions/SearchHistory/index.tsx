import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

import { SearchSuggestionsListContainer } from '../base/Container'
import { SearchSuggestionsList } from '../base/List'
import { SearchSuggestionsListTitle } from '../base/Title'
import { useSearchHistory } from './hooks'
import Icon from './Icon'

interface Props {
  variant?: string
}

const SearchSuggestionsHistory: FC<Required<Props>> = ({ variant }) => {
  const { formatMessage } = useIntl()
  const {
    searches,
    searchBar: { onSearch },
  } = useSearchHistory()

  if (!searches || searches.length === 0) {
    return null
  }

  return (
    <>
      <SearchSuggestionsListTitle
        variant={variant}
        title={formatMessage({
          id: 'suggestions.history.title',
          defaultMessage: 'History',
        })}
      />
      <SearchSuggestionsList items={searches} variant={variant}>
        {({ item: { term }, variant: v }) => (
          <Box onClick={() => onSearch(term)} variant={v}>
            <span>
              <Icon />
            </span>
            {term}
          </Box>
        )}
      </SearchSuggestionsList>
    </>
  )
}

const SearchSuggestions: FC<Props> = ({ variant = 'history' }) => (
  <SearchSuggestionsListContainer variant={variant} fallback={null}>
    <SearchSuggestionsHistory variant={variant} />
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
