import type { HTMLAttributes, ReactNode, PropsWithChildren } from 'react'
import React, { forwardRef } from 'react'

export interface SearchDropdownProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Term to be researched.
   */
  term: string
  /**
   * Enables a loading state.
   */
  isLoading: boolean
  /**
   * List of Suggestion terms.
   */
  terms: Array<{ value: string }>
  /**
   * Array with top search terms.
   */
  products: {}[]
  /**
   * A React component that will be rendered as an SearchHistory.
   */
  searchHistoryComponent: ReactNode
  /**
   * A React component that will be rendered as an SearchTop.
   */
  searchTopComponent: ReactNode
  /**
   * A React component that will be rendered as an searchAutoComplete.
   */
  searchAutoCompleteComponent: ReactNode
  /**
   * A React component that will be rendered as an searchProducts.
   */
  searchProductsComponent: ReactNode
}

const SearchDropdown = forwardRef<
  HTMLDivElement,
  PropsWithChildren<SearchDropdownProps>
>(function SearchDropdown(
  {
    testId = 'fs-search-dropdown',
    term,
    isLoading,
    terms,
    products,
    searchHistoryComponent,
    searchTopComponent,
    searchAutoCompleteComponent,
    searchProductsComponent,
    ...otherProps
  },
  ref
) {
  return (
    <div
      ref={ref}
      data-fs-search-dropdown
      // data-fs-search-input-dropdown-wrapper
      data-testid={testId}
      {...otherProps}
    >
      {(() => {
        if (term.length === 0 && !isLoading) {
          return (
            <>
              {searchHistoryComponent}
              {searchTopComponent}
            </>
          )
        }

        if (isLoading) {
          return <p data-fs-search-input-loading-text>Loading...</p>
        }

        if (terms.length === 0 && products.length === 0) {
          return null
        }

        return (
          <section>
            {terms.length > 0 && <>{searchAutoCompleteComponent}</>}
            {products.length > 0 && <>{searchProductsComponent}</>}
          </section>
        )
      })()}
    </div>
  )
})

export default SearchDropdown
