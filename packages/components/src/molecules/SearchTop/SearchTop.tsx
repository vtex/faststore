import React from 'react'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { List } from '../../'

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
   * Defines the the message displayed while loading.
   */
  loadingMessage?: string
  /**
   * Enables a loading state.
   */
  isLoading?: boolean
}

const SearchTop = forwardRef<HTMLDivElement, SearchTopProps>(function SearchTop(
  {
    testId = 'fs-top-search',
    title = 'Top Search',
    loadingMessage = 'Loading...',
    isLoading,
    children,
    ...otherProps
  },
  ref
) {
  return (
    <section ref={ref} data-testid={testId} data-fs-search-top {...otherProps}>
      {isLoading ? (
        <p data-fs-search-top-input-loading-text>{loadingMessage}</p>
      ) : (
        <>
          <header data-fs-search-top-header>
            <p data-fs-search-top-title>{title}</p>
          </header>
          <List as="ol">{children}</List>
        </>
      )}
    </section>
  )
})

export default SearchTop
