import {
  SearchProducts,
  SearchAutoComplete as UISearchAutoComplete,
  SearchAutoCompleteTerm as UISearchAutoCompleteTerm,
  SearchDropdown as UISearchDropdown,
  useSearch,
} from '@faststore/ui'
import type { Dispatch, SetStateAction } from 'react'

import { SearchHistory } from '../SearchHistory'
import { SearchTop } from '../SearchTop'

import type { SearchState } from '@faststore/sdk'
import type { ProductSummary_ProductFragment } from '@generated/graphql'
import SearchProductItem from 'src/components/search/SearchProductItem'
import type { NavbarProps } from 'src/components/sections/Navbar'
import type {
  IntelligentSearchAutocompleteClickEvent,
  IntelligentSearchAutocompleteClickParams,
} from 'src/sdk/analytics/types'
import { formatSearchPath } from 'src/sdk/search/formatSearchPath'

interface SearchDropdownProps {
  sort: SearchState['sort']
  quickOrderSettings?: NavbarProps['searchInput']['quickOrderSettings']
  [key: string]: any
  onChangeCustomSearchDropdownVisible: Dispatch<SetStateAction<boolean>>
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

function SearchDropdown({
  sort,
  quickOrderSettings,
  onChangeCustomSearchDropdownVisible,
  ...otherProps
}: SearchDropdownProps) {
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
                  term,
                  formatSearchPath({ term: term, sort })
                )
                sendAutocompleteClickEvent({
                  term: term,
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
              quickOrderSettings={quickOrderSettings}
              onChangeCustomSearchDropdownVisible={
                onChangeCustomSearchDropdownVisible
              }
            />
          )
        })}
      </SearchProducts>
    </UISearchDropdown>
  )
}

export default SearchDropdown
