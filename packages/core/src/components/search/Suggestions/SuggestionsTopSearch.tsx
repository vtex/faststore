import { List as UIList } from '@faststore/ui'
import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { Badge } from 'src/components/ui/Badge'
import Link from 'src/components/ui/Link'

export interface SuggestionsTopSearchProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * List of top searched items
   */
  // TODO: Adapts for the real received data type
  searchedItems: LinkItem[]
}

type LinkItem = {
  href: string
  name: string
}

const SuggestionsTopSearch = forwardRef<
  HTMLDivElement,
  SuggestionsTopSearchProps
>(function SuggestionsTopSearch(
  { testId = 'top-search', searchedItems, ...otherProps },
  ref
) {
  return (
    <section
      ref={ref}
      data-testid={testId}
      data-fs-search-suggestion-section
      {...otherProps}
    >
      <div data-fs-search-suggestion-header>
        <p data-fs-search-suggestion-title>Top Search</p>
      </div>
      <UIList variant="ordered">
        {searchedItems.map((item, index) => (
          <li key={item.name} data-fs-search-suggestion-item>
            <Link variant="display" href={item.href}>
              <Badge variant="info">{index + 1}</Badge>
              {item.name}
            </Link>
          </li>
        ))}
      </UIList>
    </section>
  )
})

export default SuggestionsTopSearch
