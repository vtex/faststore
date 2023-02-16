import React from 'react'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { List, Badge, Link } from '../..'

type TopTerms = {
  /**
   * Defines the text displayed in top term item.
   */
  value: string
  /**
   * Defines the url for top term item.
   */
  href: string
  /**
   * Event handler for clicks on each item.
   */
  onClick?: () => void
}

export interface SearchTopProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines the section's title.
   */
  title: string
  /**
   * Enables a loading state.
   */
  isLoading?: boolean
  /**
   * List of top searched items.
   */
  terms: TopTerms[]
}

const SearchTop = forwardRef<HTMLDivElement, SearchTopProps>(function SearchTop(
  {
    testId = 'fs-top-search',
    title = 'Top Search',
    terms,
    isLoading,
    ...otherProps
  },
  ref
) {
  if (terms.length === 0) {
    return null
  }

  return (
    <section ref={ref} data-testid={testId} data-fs-search-top {...otherProps}>
      {isLoading ? (
        <p data-fs-search-top-input-loading-text>Loading...</p>
      ) : (
        <>
          <div data-fs-search-top-header>
            <p data-fs-search-top-title>{title}</p>
          </div>
          <List as="ol">
            {terms.map((term, index) => (
              <li key={term.value} data-fs-search-top-item>
                <Link
                  data-fs-search-top-item-link
                  variant="display"
                  href={term.href}
                  onClick={term.onClick}
                >
                  <Badge data-fs-search-top-badge variant="info">
                    {index + 1}
                  </Badge>
                  {term.value}
                </Link>
              </li>
            ))}
          </List>
        </>
      )}
    </section>
  )
})

export default SearchTop
