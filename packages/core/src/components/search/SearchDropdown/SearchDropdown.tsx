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
import { NavbarProps } from 'src/components/sections/Navbar'

interface SearchDropdownProps {
  sort: SearchState['sort']
  quickOrderSettings?: NavbarProps['searchInput']['quickOrderSettings']
  [key: string]: any
}

function SearchDropdown({
  sort,
  quickOrderSettings,
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
              onClick: () =>
                onSearchSelection?.(
                  suggestion,
                  formatSearchPath({
                    term: suggestion,
                    sort,
                  })
                ),
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
            />
          )
        })}
      </SearchProducts>
    </UISearchDropdown>
  )
}

export default SearchDropdown
