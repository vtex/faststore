import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface SearchInputProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The current status of the Search Dropdown.
   */
  visibleDropdown: boolean
}

const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  function SearchInput(
    {
      children,
      visibleDropdown = false,
      testId = 'fs-search-input',
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-search-input
        data-fs-search-input-dropdown-visible={visibleDropdown}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default SearchInput
