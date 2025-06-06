import {
  SearchTop as UISearchTop,
  SearchTopTerm as UISearchTopTerm,
  useSearch,
} from '@faststore/ui'
import type { HTMLAttributes } from 'react'

import type { SearchState } from '@faststore/sdk'
import type { StoreSuggestionTerm } from '@generated/graphql'
import { formatSearchPath } from 'src/sdk/search/formatSearchPath'
import useTopSearch from 'src/sdk/search/useTopSearch'

const MAX_TOP_SEARCH_TERMS = 5

export interface SearchTopProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * List of top searched items
   */
  topTerms?: StoreSuggestionTerm[]
  /**
   * Default sort by value
   */
  sort?: string
}

function SearchTop({ topTerms = [], sort, ...otherProps }: SearchTopProps) {
  const {
    values: { onSearchSelection },
  } = useSearch()
  const { data } = useTopSearch()
  const terms = (data?.search.suggestions.terms ?? topTerms).slice(
    0,
    MAX_TOP_SEARCH_TERMS
  )

  if (terms.length === 0) {
    return null
  }

  return (
    <UISearchTop title="Top Search" {...otherProps}>
      {terms.map((term, index) => (
        <UISearchTopTerm
          key={index}
          value={term.value}
          index={index}
          linkProps={{
            href: formatSearchPath({
              term: term.value,
              sort: sort as SearchState['sort'],
            }),
            onClick: () =>
              onSearchSelection?.(
                term.value,
                formatSearchPath({
                  term: term.value,
                  sort: sort as SearchState['sort'],
                })
              ),
          }}
        />
      ))}
    </UISearchTop>
  )
}

export default SearchTop
