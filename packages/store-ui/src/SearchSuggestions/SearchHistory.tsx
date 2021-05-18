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
  items?: Array<{ key: string; term: string }>
  variant?: string
}

const SearchSuggestionsHistory: FC<Required<Props>> = ({ variant, items }) => {
  const {
    searchBar: { onSearch },
  } = useSearchSuggestions()

  return (
    <SearchSuggestionsList items={items} variant={variant}>
      {({ item: { term }, variant: v }) => (
        <Box onClick={() => onSearch(term)} variant={v}>
          <span>
            <svg
              className="vtex__icon-clock  "
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 22 10"
              fill="none"
            >
              <path
                d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14Z"
                fill="currentColor"
              />
              <path
                d="M2 0H0V5H5V3H2V0Z"
                transform="translate(7 4)"
                fill="currentColor"
              />
            </svg>
          </span>
          {term}
        </Box>
      )}
    </SearchSuggestionsList>
  )
}

const SearchSuggestions: FC<Props> = ({ variant = 'history', items }) => (
  <SearchSuggestionsContainer variant={variant} fallback={null}>
    <SearchSuggestionsTitle variant={variant}>
      <FormattedMessage id="suggestions.history.title" />
    </SearchSuggestionsTitle>

    {items != null &&
      (items.length === 0 ? (
        <Center>
          <FormattedMessage id="suggestions.history.empty" />
        </Center>
      ) : (
        <SearchSuggestionsHistory variant={variant} items={items} />
      ))}
  </SearchSuggestionsContainer>
)

export default SearchSuggestions
