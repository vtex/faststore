import {
  SearchProducts,
  SearchAutoComplete as UISearchAutoComplete,
  SearchAutoCompleteTerm as UISearchAutoCompleteTerm,
  SearchDropdown as UISearchDropdown,
  useSearch,
} from '@faststore/ui'

import { SearchHistory } from '../SearchHistory'
import { SearchTop } from '../SearchTop'

import { SearchState } from '@faststore/sdk'
import { ProductSummary_ProductFragment } from '@generated/graphql'
import SearchProductItem from 'src/components/search/SearchProductItem'
import { formatSearchPath } from 'src/sdk/search/formatSearchPath'
import type {
  IntelligentSearchAutocompleteClickEvent,
  IntelligentSearchAutocompleteClickParams,
} from 'src/sdk/analytics/types'

interface SearchDropdownProps {
  sort: SearchState['sort']
  [key: string]: any
}

export function sendAutocompleteClickEvent({
  url,
  term,
  position,
  productId,
}: IntelligentSearchAutocompleteClickParams) {
  import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
    sendAnalyticsEvent<IntelligentSearchAutocompleteClickEvent>({
      name: 'intelligent_search_autocomplete_click',
      params: { term, url, productId, position },
    })
  })
}

function SearchDropdown({ sort, ...otherProps }: SearchDropdownProps) {
  const {
    values: { onSearchSelection, products, term, terms },
  } = useSearch()

  return (
    <UISearchDropdown {...otherProps}>
      <SearchHistory sort={sort} />
      <SearchTop sort={sort} />
      <UISearchAutoComplete>
        {terms?.map(({ value: suggestion }) => (
          <UISearchAutoCompleteTerm
            key={suggestion}
            term={term}
            suggestion={suggestion}
            linkProps={{
              href: formatSearchPath({
                term: suggestion,
                sort,
              }),
              onClick: () => {
                onSearchSelection?.(
                  suggestion,
                  formatSearchPath({ term: suggestion, sort })
                )
                sendAutocompleteClickEvent({
                  term: suggestion,
                  url: window.location.href,
                })
              },
            }}
          />
        ))}
      </UISearchAutoComplete>
      <SearchProducts>
        {products.map((product, index) => {
          const productParsed = product as ProductSummary_ProductFragment
          return (
            <SearchProductItem
              key={productParsed.id}
              product={productParsed}
              index={index}
            />
          )
        })}
      </SearchProducts>
    </UISearchDropdown>
  )
}

export default SearchDropdown
