import React from 'react'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { List, useSearch } from '../../'

export interface SearchTopProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Title attribute for the <section> tag rendered by this component.
   */
  title: string
}

const SearchTop = forwardRef<HTMLDivElement, SearchTopProps>(function SearchTop(
  {
    testId = 'fs-top-search',
    title = 'Top Search',
    children,
    ...otherProps
  },
  ref
) {

  const { inContext, values } = useSearch()

  if (inContext && (values.term.length !== 0 || values.isLoading)) {
    return null
  }

  return (
    <section ref={ref} data-testid={testId} data-fs-search-top {...otherProps}>
        <header data-fs-search-top-header>
          <p data-fs-search-top-title>{title}</p>
        </header>
        <List as="ol">{children}</List>
    </section>
  )
})

export default SearchTop
