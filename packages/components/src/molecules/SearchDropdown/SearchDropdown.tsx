import type { ComponentProps } from 'react'
import React from 'react'
import { useSearch } from '../../hooks'

export interface SearchDropdownProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
}

function SearchLoading() {
  const { inContext, values } = useSearch()

  return (
    <>
      {inContext && values.isLoading && (
        <p data-fs-search-dropdown-loading-text>Loading...</p>
      )}
    </>
  )
}

export default function SearchDropdown({
  testId = 'fs-search-dropdown',
  children,
  ref,
  ...otherProps
}: SearchDropdownProps) {
  return (
    <div ref={ref} data-fs-search-dropdown data-testid={testId} {...otherProps}>
      <section>
        <SearchLoading />
        {children}
      </section>
    </div>
  )
}
