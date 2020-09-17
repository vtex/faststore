import { useIntl } from '@vtex/gatsby-plugin-i18n'
import {
  SearchSuggestions as SearchSuggestionsProvider,
  useSearchBarContext,
} from '@vtex/store-ui'
import React, { FC } from 'react'

import SearchSuggestionsProduct from './Products'
import SearchSuggestionsTopSearches from './TopSearches'

const SearchSuggestions: FC = () => {
  const { formatMessage } = useIntl()
  const { term } = useSearchBarContext()

  return (
    <SearchSuggestionsProvider>
      {term ? (
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
      ) : (
        <SearchSuggestionsTopSearches
          title={formatMessage({
            id: 'search.suggestions.topSearches.title',
            defaultMessage: 'Top Searches',
          })}
        />
      )}
    </SearchSuggestionsProvider>
  )
}

export default SearchSuggestions
