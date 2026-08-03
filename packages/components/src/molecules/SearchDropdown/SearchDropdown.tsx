import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import React, { forwardRef } from 'react'
import { useSearch } from '../../hooks'

export interface SearchDropdownProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  children?: ReactNode
  loadingLabel?: string
}

const SearchLoading = ({ loadingLabel }: { loadingLabel?: string }) => {
  const { inContext, values } = useSearch()

  return (
    <>
      {inContext && values.isLoading && (
        <p data-fs-search-dropdown-loading-text>{loadingLabel}</p>
      )}
    </>
  )
}

const SearchDropdown = forwardRef<
  HTMLDivElement,
  PropsWithChildren<SearchDropdownProps>
>(function SearchDropdown(
  { testId = 'fs-search-dropdown', children, loadingLabel, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-search-dropdown data-testid={testId} {...otherProps}>
      <section>
        <SearchLoading loadingLabel={loadingLabel} />
        {children}
      </section>
    </div>
  )
})

export default SearchDropdown
