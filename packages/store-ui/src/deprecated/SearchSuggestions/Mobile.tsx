import React from 'react'
import type { FC } from 'react'

import { useSearchSuggestions } from './base/useSearchSuggestions'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsTopSearches from './TopSearches'
import type { SummaryComponent } from './Products'

interface Item {
  key: string
  term: string
}

interface Props {
  topSearches: Item[] | undefined
  SummaryComponent: SummaryComponent
  products: Array<{ key: string }>
  total: number
}

const SearchSuggestions: FC<Props> = ({
  topSearches,
  products,
  total,
  SummaryComponent: ProductSummary,
}) => {
  const { term } = useSearchSuggestions()

  if (term.length === 0) {
    return <SearchSuggestionsTopSearches items={topSearches} />
  }

  return term ? (
    <SearchSuggestionsProduct
      SummaryComponent={ProductSummary}
      items={products}
      total={total}
      term={term}
    />
  ) : null
}

export default SearchSuggestions
