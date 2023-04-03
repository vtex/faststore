import {
  SearchAutoComplete as UISearchAutoComplete,
  SearchAutoCompleteTerm as UISearchAutoCompleteTerm,
  SearchDropdown as UISearchDropdown,
  SearchProducts,
  useSearch,
} from '@faststore/ui'

import { SearchHistory } from '../SearchHistory'
import { SearchTop } from '../SearchTop'

import SearchProductItem from 'src/components/search/SearchProductItem'
import { formatSearchPath } from 'src/sdk/search/formatSearchPath'
import { ProductSummary_ProductFragment } from '@generated/graphql'

function SearchDropdown({ ...otherProps }) {
  const {
    values: { onSearchSelection, products, term, terms },
  } = useSearch()

  return (
    <UISearchDropdown {...otherProps}>
      <SearchHistory />
      <SearchTop />
      <UISearchAutoComplete>
        {terms?.map(({ value: suggestion }) => (
          <UISearchAutoCompleteTerm
            key={suggestion}
            term={term}
            suggestion={suggestion}
            linkProps={{
              href: formatSearchPath(suggestion),
              onClick: () =>
                onSearchSelection?.(suggestion, formatSearchPath(suggestion)),
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
