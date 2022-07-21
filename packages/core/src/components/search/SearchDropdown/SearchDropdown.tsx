import type { SearchSuggestionsProps } from 'src/components/search/SearchSuggestions'
import SearchSuggestions from 'src/components/search/SearchSuggestions'
import useSuggestions from 'src/sdk/search/useSuggestions'

import type { SearchHistoryProps } from '../SearchHistory'
import { SearchHistory } from '../SearchHistory'
import { SearchTop } from '../SearchTop'

export type SearchDropdownProps = SearchHistoryProps & SearchSuggestionsProps

function SearchDropdown({
  term = '',
  history,
  style,
  ...otherProps
}: SearchDropdownProps) {
  const { terms, products, isLoading } = useSuggestions(term)

  if (term.length === 0 && !isLoading) {
    return (
      <>
        <SearchHistory history={history} />
        <SearchTop />
      </>
    )
  }

  if (isLoading) {
    return <p data-fs-search-input-loading-text>Loading...</p>
  }

  if (terms.length === 0 && products.length === 0) {
    return null
  }

  return (
    <SearchSuggestions
      term={term}
      terms={terms}
      products={products}
      {...otherProps}
    />
  )
}

export default SearchDropdown
