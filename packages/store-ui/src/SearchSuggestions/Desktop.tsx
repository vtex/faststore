import React from 'react'
import type { FC } from 'react'

import SearchSuggestionsAutocomplete from './Autocomplete'
import { useSearchSuggestions } from './base/useSearchSuggestions'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsHistory from './SearchHistory'
import SearchSuggestionsTopSearches from './TopSearches'
import type { SummaryComponent } from './Products'

interface Item {
  key: string
  term: string
}

interface Props {
  topSearches: Item[] | undefined
  history: Item[] | undefined
  autocomplete: Item[] | undefined
  SummaryComponent: SummaryComponent
  products: Array<{ key: string }>
  total: number
}

const SearchSuggestions: FC<Props> = ({
  topSearches,
  history,
  autocomplete,
  products,
  total,
  SummaryComponent: ProductSummary,
}) => {
  const {
    term,
    searchBar: { asyncTerm },
  } = useSearchSuggestions()

  if (term.length === 0) {
    return (
      <>
        <SearchSuggestionsTopSearches items={topSearches} />
        <SearchSuggestionsHistory items={history} />
      </>
    )
  }

  return (
    <>
      {asyncTerm ? (
        <SearchSuggestionsAutocomplete items={autocomplete} /> // term={asyncTerm}
      ) : null}
      {term ? (
        <SearchSuggestionsProduct
          SummaryComponent={ProductSummary}
          items={products}
          total={total}
          term={term}
        />
      ) : null}
    </>
  )
}

export default SearchSuggestions
