import React from 'react'
import type { ComponentProps } from 'react'

import { List, useSearch } from '../../'

export interface SearchTopProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Title attribute for the <section> tag rendered by this component.
   */
  title: string
}

export default function SearchTop({
  testId = 'fs-top-search',
  title = 'Top Search',
  children,
  ref,
  ...otherProps
}: SearchTopProps) {
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
}
