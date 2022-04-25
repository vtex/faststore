import { formatSearchState, initSearchState } from '@faststore/sdk'
import { Icon as UIIcon, List as UIList } from '@faststore/ui'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import useSearchHistory from 'src/sdk/search/useSearchHistory'

interface SearchHistoryProps {
  onClear: () => void
}

const doSearch = (term: string) => {
  const { pathname, search } = formatSearchState(
    initSearchState({
      term,
      base: '/s',
    })
  )

  return `${pathname}${search}`
}

const SearchHistory = ({ onClear }: SearchHistoryProps) => {
  const { searchHistory } = useSearchHistory()

  return (
    <section data-store-search-history>
      <div data-store-search-history-header>
        <h4 data-store-search-history-title>History</h4>
        <Button variant="tertiary" onClick={onClear}>
          Clear
        </Button>
      </div>
      <UIList variant="ordered">
        {searchHistory.map((item, index) => (
          <li data-store-search-history-item key={index}>
            <Link
              variant="display"
              href={doSearch(item)}
              target="_blank"
              rel="noreferrer"
            >
              <UIIcon
                component={<Icon name="Clock" width={18} height={18} />}
              />
              {item}
              <UIIcon
                data-store-search-history-arrow
                component={
                  <Icon name="ArrowUpRight" width={13.5} height={13.5} />
                }
              />
            </Link>
          </li>
        ))}
      </UIList>
    </section>
  )
}

export default SearchHistory
