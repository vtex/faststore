import React from 'react'
import type { FC } from 'react'

import { useSearchSuggestionsContext } from './base/hooks'
import SearchSuggestionsProduct from './Products'
import SearchSuggestionsTopSearches from './TopSearches'

interface Props {
  regionId?: string | null
}

const SearchSuggestions: FC<Props> = ({ regionId }: Props) => {
  const { term } = useSearchSuggestionsContext()

  if (term.length === 0) {
    return <SearchSuggestionsTopSearches />
  }

  return term ? (
    <SearchSuggestionsProduct maxItems={2} term={term} regionId={regionId} />
  ) : null
}

export default SearchSuggestions
