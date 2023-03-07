import React, { HTMLAttributes } from 'react'
import { List } from '../..'

export interface SearchSuggestedProductsProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Title attribute for the <section> tag rendered by this component.
   */
  title?: string
}

const SearchSuggestedProducts = ({
  testId = 'fs-search-suggested-products',
  title = 'Suggested Products',
  children,
  ...otherProps
}: SearchSuggestedProductsProps) => {
  return (
    <section
      data-testid={testId}
      data-fs-search-suggested-products
      {...otherProps}
    >
      <header data-fs-search-suggested-products-header>
        <p data-fs-search-suggested-products-title>{title}</p>
      </header>
      <List as="ol">{children}</List>
    </section>
  )
}

export default SearchSuggestedProducts
