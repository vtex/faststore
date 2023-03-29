import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import SearchProvider, { SearchProviderContextValue } from '../../molecules/SearchProvider'


export type SearchInputProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The current status of the Search Dropdown.
   */
  visibleDropdown: boolean
} & HTMLAttributes<HTMLDivElement> & SearchProviderContextValue

const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  function SearchInput(
    {
      children,
      visibleDropdown = false,
      testId = 'fs-search-input',
      isLoading,
      products,
      term,
      terms,
      onSearchSelection,
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
        <SearchProvider 
          onSearchSelection={onSearchSelection} 
          isLoading={isLoading} 
          term={term} 
          products={products} 
          terms={terms}
        >
          {children}
        </SearchProvider>
      </div>
    )
  }
)

export default SearchInput
