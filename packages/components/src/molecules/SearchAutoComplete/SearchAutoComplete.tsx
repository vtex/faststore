import React, { HTMLAttributes } from 'react'
import { List, useSearch } from '../..'

export interface SearchAutoCompleteProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const SearchAutoComplete = ({
  testId = 'fs-search-auto-complete',
  children,
  ...otherProps
}: SearchAutoCompleteProps) => {

  const { inContext, values } = useSearch()

  if (inContext && (values.terms.length <= 0 || values.term.length <= 0)) {
    return null
  }

  return (
    <section data-testid={testId} data-fs-search-auto-complete {...otherProps}>
      <List as="ol">{children}</List>
    </section>
  )
}

export default SearchAutoComplete
