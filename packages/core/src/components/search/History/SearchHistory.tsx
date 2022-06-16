import { List as UIList } from '@faststore/ui'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSearchInput from 'src/sdk/search/useSearchInput'
import type { History } from 'src/sdk/search/useSearchHistory'

export interface SearchHistoryProps {
  history?: History[]
}

const SearchHistory = ({ history = [] }: SearchHistoryProps) => {
  const { onSearchInputSelection } = useSearchInput()
  const { searchHistory, clearSearchHistory } = useSearchHistory(history)

  if (!searchHistory.length) {
    return null
  }

  return (
    <section data-fs-search-suggestion-section>
      <div data-fs-search-suggestion-header>
        <p data-fs-search-suggestion-title>History</p>
        <Button variant="tertiary" onClick={clearSearchHistory}>
          Clear History
        </Button>
      </div>
      <UIList variant="ordered">
        {searchHistory.map((item) => (
          <li key={item.term} data-fs-search-suggestion-item>
            <Link
              variant="display"
              href={item.path}
              onClick={() => onSearchInputSelection?.(item.term, item.path)}
            >
              <Icon
                name="Clock"
                width={18}
                height={18}
                data-fs-search-suggestion-item-icon
              />
              {item.term}
            </Link>
          </li>
        ))}
      </UIList>
    </section>
  )
}

export default SearchHistory
