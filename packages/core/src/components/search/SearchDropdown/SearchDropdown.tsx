import type { SearchSuggestionsProps } from 'src/components/search/SearchSuggestions'
import SearchSuggestions from 'src/components/search/SearchSuggestions'
import useSuggestions from 'src/sdk/search/useSuggestions'

import { SearchHistory } from '../SearchHistory'
import { SearchTop } from '../SearchTop'

export type SearchDropdownProps = SearchSuggestionsProps

import styles from './search-dropdown.module.scss'

function SearchDropdown({
  term = '',
  style,
  ...otherProps
}: SearchDropdownProps) {
  const { terms, products, isLoading } = useSuggestions(term)

  return (
    <div
      className={styles.fsSearchDropdown}
      data-fs-search-input-dropdown-wrapper
    >
      {(() => {
        if (term.length === 0 && !isLoading) {
          return (
            <>
              <SearchHistory data-fs-search-section />
              <SearchTop data-fs-search-section />
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
      })()}
    </div>
  )
}

export default SearchDropdown
