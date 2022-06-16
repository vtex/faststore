import { List as UIList } from '@faststore/ui'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { Badge } from 'src/components/ui/Badge'
import Link from 'src/components/ui/Link'
import useSearchInput, { formatSearchPath } from 'src/sdk/search/useSearchInput'
import useTopSearch from 'src/sdk/search/useTopSearch'
import type { StoreSuggestionTerm } from '@generated/graphql'

export interface SuggestionsTopSearchProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * List of top searched items
   */
  topTerms?: StoreSuggestionTerm[]
}

const SuggestionsTopSearch = forwardRef<
  HTMLDivElement,
  SuggestionsTopSearchProps
>(function SuggestionsTopSearch(
  { testId = 'top-search', topTerms, ...otherProps },
  ref
) {
  const { onSearchInputSelection } = useSearchInput()
  const { terms, isLoading } = useTopSearch(topTerms)

  if (isLoading) {
    return <p data-fs-search-input-loading-text>Loading...</p>
  }

  if (terms.length === 0) {
    return null
  }

  return (
    <section
      ref={ref}
      data-testid={testId}
      data-fs-search-suggestion-section
      {...otherProps}
    >
      <div data-fs-search-suggestion-header>
        <p data-fs-search-suggestion-title>Top Search</p>
      </div>
      <UIList variant="ordered">
        {terms.map((term, index) => (
          <li key={term.value} data-fs-search-suggestion-item>
            <Link
              variant="display"
              href={formatSearchPath(term.value)}
              onClick={() =>
                onSearchInputSelection?.(
                  term.value,
                  formatSearchPath(term.value)
                )
              }
            >
              <Badge variant="info">{index + 1}</Badge>
              {term.value}
            </Link>
          </li>
        ))}
      </UIList>
    </section>
  )
})

export default SuggestionsTopSearch
