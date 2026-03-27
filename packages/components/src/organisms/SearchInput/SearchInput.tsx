import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import SearchProvider, {
  type SearchProviderContextValue,
} from '../../molecules/SearchProvider'

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
  /**
   * Search result searchId.
   */
  searchId?: string
} & HTMLAttributes<HTMLDivElement> &
  SearchProviderContextValue

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
      searchId,
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
          searchId={searchId}
        >
          {children}
        </SearchProvider>
      </div>
    )
  }
)

export default SearchInput
