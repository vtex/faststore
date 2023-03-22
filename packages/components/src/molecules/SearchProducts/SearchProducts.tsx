import React, { HTMLAttributes } from 'react'
import { List, useSearch } from '../..'

export interface SearchProductsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Title attribute for the <section> tag rendered by this component.
   */
  title?: string
}

const SearchProductsProps = ({
  testId = 'fs-search-products',
  title = 'Suggested Products',
  children,
  ...otherProps
}: SearchProductsProps) => {
  const { inContext, values } = useSearch()

  if (inContext && (values.products.length <= 0)) {
    return null
  }
  return (
    <section data-testid={testId} data-fs-search-products {...otherProps}>
      <header data-fs-search-products-header>
        <p data-fs-search-products-title>{title}</p>
      </header>
      <List as="ol">{children}</List>
    </section>
  )
}

export default SearchProductsProps
