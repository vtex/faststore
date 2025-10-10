import {
  SearchProducts,
  SearchAutoComplete as UISearchAutoComplete,
  SearchAutoCompleteTerm as UISearchAutoCompleteTerm,
  SearchDropdown as UISearchDropdown,
  useSearch,
} from '@vtex/faststore-ui'
import type React from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { SearchHistory } from '../SearchHistory'
import { SearchTop } from '../SearchTop'

import type { SearchState } from '@vtex/faststore-sdk'
import type { ProductSummary_ProductFragment } from '../../../../@generated/graphql'
import type {
  IntelligentSearchAutocompleteClickEvent,
  IntelligentSearchAutocompleteClickParams,
} from '../../../sdk/analytics/types'
import { formatSearchPath } from '../../../sdk/search/formatSearchPath'
import type { NavbarProps } from '../../sections/Navbar'
import SearchProductItem from '../SearchProductItem'

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
  return import('@vtex/faststore-sdk').then(({ sendAnalyticsEvent }) => {
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
