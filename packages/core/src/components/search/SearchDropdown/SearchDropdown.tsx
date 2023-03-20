import useSuggestions from 'src/sdk/search/useSuggestions'

import {
  SearchAutoComplete as UISearchAutoComplete,
  SearchAutoCompleteTerm as UISearchAutoCompleteTerm,
  SearchDropdown as UISearchDropdown,
  SearchProducts,
} from '@faststore/ui'

import { SearchHistory } from '../SearchHistory'
import { SearchTop } from '../SearchTop'

import SearchProductItem from 'src/components/search/SearchProductItem'
import useSearchInput, { formatSearchPath } from 'src/sdk/search/useSearchInput'

export type SearchDropdownProps = {
  term: string
}

function SearchDropdown({ term = '', ...otherProps }: SearchDropdownProps) {
  const { terms, products, isLoading } = useSuggestions(term)
  const { onSearchInputSelection } = useSearchInput()

  return (
    <UISearchDropdown
      term={term}
      terms={terms}
      isLoading={isLoading}
      products={products}
      searchHistoryComponent={<SearchHistory />}
      searchTopComponent={<SearchTop />}
      searchAutoCompleteComponent={
        <UISearchAutoComplete data-fs-search-section>
          {terms?.map(({ value: suggestion }) => (
            <UISearchAutoCompleteTerm
              key={suggestion}
              term={term}
              suggestion={suggestion}
              linkProps={{
                href: formatSearchPath(suggestion),
                onClick: () =>
                  onSearchInputSelection?.(
                    suggestion,
                    formatSearchPath(suggestion)
                  ),
              }}
            />
          ))}
        </UISearchAutoComplete>
      }
      searchProductsComponent={
        <SearchProducts data-fs-search-section>
          {products.map((product, index) => (
            <SearchProductItem
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </SearchProducts>
      }
      {...otherProps}
    />
  )
}

export default SearchDropdown
