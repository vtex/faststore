import {
  SearchTop as UISearchTop,
  SearchTopTerm as UISearchTopTerm,
  useSearch,
} from '@faststore/ui'
import type { HTMLAttributes } from 'react'

import type { SearchState } from '@faststore/sdk'
import type { StoreSuggestionTerm } from '@generated/graphql'
import { useFormatSearchPath } from 'src/sdk/search/formatSearchPath'
import useTopSearch from 'src/sdk/search/useTopSearch'
import { useSearchBase } from 'src/sdk/search/useSearchBase'

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
  /**
   * Title for the top search section
   */
  title?: string
}

function SearchTop({
  topTerms = [],
  sort,
  title,
  ...otherProps
}: SearchTopProps) {
  const {
    values: { onSearchSelection },
  } = useSearch()
  const formatSearchPath = useFormatSearchPath()
  const { data } = useTopSearch()
  const terms = (data?.search.suggestions.terms ?? topTerms).slice(
    0,
    MAX_TOP_SEARCH_TERMS
  )

  if (terms.length === 0) {
    return null
  }

  return (
    <UISearchTop title={title} {...otherProps}>
      {terms.map((term, index) => {
        const path = formatSearchPath({
          term: term.value,
          sort: sort as SearchState['sort'],
        })
        return (
          <UISearchTopTerm
            key={index}
            value={term.value}
            index={index}
            linkProps={{
              href: path,
              onClick: () => onSearchSelection?.(term.value, path),
            }}
          />
        )
      })}
    </UISearchTop>
  )
}

export default SearchTop
