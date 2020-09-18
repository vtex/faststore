import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { useSearchBarContext } from '@vtex/store-ui'
import React, { FC } from 'react'

import { SearchSuggestionsProvider } from './base/Provider'
import SearchSuggestionsAutocomplete from './Autocomplete'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsHistory from './SearchHistory'
import SearchSuggestionsTopSearches from './TopSearches'

const SearchSuggestions: FC = () => {
  const { formatMessage } = useIntl()
  const { term } = useSearchBarContext()

  return (
    <SearchSuggestionsProvider>
      {term ? (
        <>
          <SearchSuggestionsAutocomplete
            title={formatMessage({
              id: 'search.suggestions.autocomplete.title',
              defaultMessage: 'Suggestions',
            })}
          />
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
            maxItems={3}
          />
        </>
      ) : (
        <>
          <SearchSuggestionsHistory
            title={formatMessage({
              id: 'search.suggestions.history.title',
              defaultMessage: 'History',
            })}
          />
          <SearchSuggestionsTopSearches
            title={formatMessage({
              id: 'search.suggestions.topSearches.title',
              defaultMessage: 'Top Searches',
            })}
          />
        </>
      )}
    </SearchSuggestionsProvider>
  )
}

export default SearchSuggestions
