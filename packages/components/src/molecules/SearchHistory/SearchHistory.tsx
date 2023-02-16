import React, { HTMLAttributes } from 'react'
import { List, Link, Icon, Button, ClockClockwise } from '../..'

type HistoryTerm = {
  /**
   * Defines the text displayed in history term item.
   */
  term: string
  /**
   * Defines the url for history item.
   */
  path: string
  /**
   * Event handler for clicks on each item.
   */
  onClick?: () => void
}

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
  clearLabel: string
  /**
   * List of most recent searched items.
   */
  terms: HistoryTerm[]
  /**
   * Event handler for clicks on each item.
   */
  onClick?: () => void
}

const SearchHistory = ({
  testId = 'fs-search-history',
  title = 'History',
  clearLabel = 'Clear History',
  onClick,
  terms,
}: SearchHistoryProps) => {
  if (!terms.length) {
    return null
  }

  return (
    <section data-testid={testId} data-fs-search-history>
      <div data-fs-search-history-header>
        <p data-fs-search-history-title>{title}</p>
        <Button variant="tertiary" onClick={onClick} size="small">
          {clearLabel}
        </Button>
      </div>
      <List as="ol">
        {terms.map((item) => (
          <li key={item.term} data-fs-search-history-item>
            <Link
              data-fs-search-history-item-link
              variant="display"
              href={item.path}
              onClick={item.onClick}
            >
              <Icon
                component={<ClockClockwise />}
                data-fs-search-history-item-icon
              />
              <span>{item.term}</span>
            </Link>
          </li>
        ))}
      </List>
    </section>
  )
}

export default SearchHistory
