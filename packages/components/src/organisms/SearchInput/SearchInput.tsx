import type { ComponentProps } from 'react'
import SearchProvider, {
  type SearchProviderContextValue,
} from '../../molecules/SearchProvider'

export interface SearchInputProps
  extends ComponentProps<'div'>,
    SearchProviderContextValue {
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
  /**
   * The current status of the Search Dropdown.
   */
  visibleDropdown: boolean
}

export default function SearchInput({
  children,
  visibleDropdown = false,
  testId = 'fs-search-input',
  isLoading,
  products,
  term,
  terms,
  onSearchSelection,
  ref,
  ...otherProps
}: SearchInputProps) {
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
