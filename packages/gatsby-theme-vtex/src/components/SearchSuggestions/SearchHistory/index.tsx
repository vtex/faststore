import { Box } from '@vtex/store-ui'
import React, { FC } from 'react'

import { SearchSuggestionsListContainer } from '../base/Container'
import { SearchSuggestionsList } from '../base/List'
import { SearchSuggestionsListTitle } from '../base/Title'
import { useSearchHistory } from './hooks'
import Icon from './Icon'

interface Props {
  variant?: string
  title: string
}

const SearchSuggestionsHistory: FC<Required<Props>> = ({ title, variant }) => {
  const { searches, onSearch } = useSearchHistory()

  if (!searches || searches.length === 0) {
    return null
  }

  return (
    <>
      <SearchSuggestionsListTitle variant={variant} title={title} />
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

const SearchSuggestions: FC<Props> = ({ title, variant = 'history' }) => (
  <SearchSuggestionsListContainer variant={variant}>
    <SearchSuggestionsHistory title={title} variant={variant} />
  </SearchSuggestionsListContainer>
)

export default SearchSuggestions
