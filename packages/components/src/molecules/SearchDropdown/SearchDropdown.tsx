import type { HTMLAttributes, ReactNode, PropsWithChildren } from 'react'
import React, { forwardRef } from 'react'
import { useSearch } from '../../hooks'

export interface SearchDropdownProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  children?: ReactNode
}

const SearchLoading = () => {
  const { inContext, values } = useSearch()

  return (
    <>
      { (inContext && values.isLoading) && <p data-fs-search-dropdown-loading-text>Loading...</p> }
    </>
  )
}

const SearchDropdown = forwardRef<
  HTMLDivElement,
  PropsWithChildren<SearchDropdownProps>
>(function SearchDropdown(
  {
    testId = 'fs-search-dropdown',
    children,
    ...otherProps
  },
  ref
) {
  return (
    <div ref={ref} data-fs-search-dropdown data-testid={testId} {...otherProps}>
      <section>
        <SearchLoading/>
        {children}
      </section>
    </div>
  )
})

export default SearchDropdown
