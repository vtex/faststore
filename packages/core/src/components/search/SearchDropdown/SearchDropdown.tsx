import {
  SearchProducts,
  SearchAutoComplete as UISearchAutoComplete,
  SearchAutoCompleteTerm as UISearchAutoCompleteTerm,
  SearchDropdown as UISearchDropdown,
  useSearch,
} from '@faststore/ui'
import React, { type Dispatch, type SetStateAction } from 'react'

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
  onChangeCustomSearchDropdownVisible?: Dispatch<SetStateAction<boolean>>
}

export function sendAutocompleteClickEvent({
  url,
  term,
  position,
  productId,
}: IntelligentSearchAutocompleteClickParams) {
  return import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
    return sendAnalyticsEvent<IntelligentSearchAutocompleteClickEvent>({
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
    values: { onSearchSelection, products, term, terms, searchId },
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
              onClick: async (event: React.MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault()

                const href = formatSearchPath({ term: suggestion, sort })

                // Execute search selection callback
                onSearchSelection?.(
                  term,
                  formatSearchPath({ term: term, sort })
                )

                // Wait for analytics event to complete
                try {
                  await sendAutocompleteClickEvent({
                    term: term,
                    url: window.location.href,
                  })
                } catch (_) {}

                // Navigate after events are completed
                window.location.href = href
              },
            }}
          />
        ))}
      </UISearchAutoComplete>
      <SearchProducts
        data-af-element={searchId && 'search-autocomplete'}
        data-af-onimpression={!!searchId}
        data-af-search-id={searchId}
      >
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
              data-af-element={searchId && 'search-autocomplete'}
              data-af-onclick={!!(searchId && productParsed.id)}
              data-af-search-id={searchId}
              data-af-product-position={searchId && index + 1} // Product position in Search Analytics starts with 1
              data-af-product-id={searchId && productParsed.id}
            />
          )
        })}
      </SearchProducts>
    </UISearchDropdown>
  )
}

export default SearchDropdown
