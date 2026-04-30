import {
  SearchTop as UISearchTop,
  SearchTopTerm as UISearchTopTerm,
  type SearchTopProps as UISearchTopProps,
  useSearch,
} from '@faststore/ui'

import type { SearchState } from '@faststore/sdk'
import type { StoreSuggestionTerm } from '@generated/graphql'
import { formatSearchPath } from 'src/sdk/search/formatSearchPath'
import useTopSearch from 'src/sdk/search/useTopSearch'

const MAX_TOP_SEARCH_TERMS = 5

export interface SearchTopProps extends Omit<UISearchTopProps, 'title'> {
  /**
   * List of top searched items
   */
  topTerms?: StoreSuggestionTerm[]
  /**
   * Default sort by value
   */
  sort?: string
  title?: string
}

function SearchTop({
  topTerms = [],
  sort,
  title = 'Top Search',
  ...otherProps
}: SearchTopProps) {
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
    <UISearchTop title={title} {...otherProps}>
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
