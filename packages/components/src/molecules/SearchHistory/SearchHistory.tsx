import React, { HTMLAttributes } from 'react'
import { List, Button } from '../..'

export interface SearchHistoryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines the section's title.
   */
  title: string
  /**
   * Defines the text displayed in clear history button.
   */
  clearLabel?: string
  /**
   * Event handler for click on clear history button.
   */
  onClearClick?: () => void
}

const SearchHistory = ({
  testId = 'fs-search-history',
  title = 'History',
  clearLabel = 'Clear History',
  onClearClick,
  children,
  ...otherProps
}: SearchHistoryProps) => {
  return (
    <section data-testid={testId} data-fs-search-history {...otherProps}>
      <header data-fs-search-history-header>
        <p data-fs-search-history-title>{title}</p>
        <Button variant="tertiary" onClick={onClearClick} size="small">
          {clearLabel}
        </Button>
      </header>
      <List as="ol">{children}</List>
    </section>
  )
}

export default SearchHistory
