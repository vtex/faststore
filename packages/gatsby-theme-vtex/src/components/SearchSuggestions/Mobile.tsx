import { useIntl } from '@vtex/gatsby-plugin-i18n'
import React, { FC } from 'react'

import { useSearchSuggestionsContext } from './base/hooks'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsTopSearches from './TopSearches'

const SearchSuggestions: FC = () => {
  const { formatMessage } = useIntl()
  const { term } = useSearchSuggestionsContext()

  if (term) {
    return (
      <SearchSuggestionsProduct
        title={formatMessage({
          id: 'search.suggestions.products.title',
          defaultMessage: 'Products for: ',
        })}
        countDesc={(total: number) =>
          formatMessage(
            {
              id: 'search.suggestions.products.total',
              defaultMessage: 'See all {total} items',
            },
            { total }
          )
        }
        maxItems={2}
      />
    )
  }

  return (
    <SearchSuggestionsTopSearches
      title={formatMessage({
        id: 'search.suggestions.topSearches.title',
        defaultMessage: 'Top Searches',
      })}
    />
  )
}

export default SearchSuggestions
