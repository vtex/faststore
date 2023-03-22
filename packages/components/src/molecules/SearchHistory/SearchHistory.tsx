import React, { HTMLAttributes } from 'react'
import { List, Button, useSearch } from '../..'

export interface SearchHistoryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Title attribute for the <section> tag rendered by this component.
   */
  title: string
  /**
   * Defines the text displayed in clear history button.
   */
  clearLabel?: string
  /**
   * Event handler for click on clear history button.
   */
  onClear?: () => void
}

const SearchHistory = ({
  testId = 'fs-search-history',
  title = 'History',
  clearLabel = 'Clear History',
  onClear,
  children,
  ...otherProps
}: SearchHistoryProps) => {

  const { inContext, values } = useSearch()

  if (inContext && (values.term.length !== 0 || values.isLoading)) {
    return null
  }

  return (
    <section data-testid={testId} data-fs-search-history {...otherProps}>
      <header data-fs-search-history-header>
        <p data-fs-search-history-title>{title}</p>
        <Button variant="tertiary" onClick={onClear} size="small">
          {clearLabel}
        </Button>
      </header>
      <List as="ol">{children}</List>
    </section>
  )
}

export default SearchHistory
