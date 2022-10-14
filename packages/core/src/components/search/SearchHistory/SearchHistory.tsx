import { List as UIList } from '@faststore/ui'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import Link from 'src/components/ui/Link'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSearchInput from 'src/sdk/search/useSearchInput'

import styles from '../search.module.scss'

const SearchHistory = () => {
  const { onSearchInputSelection } = useSearchInput()
  const { searchHistory, clearSearchHistory } = useSearchHistory()

  if (!searchHistory.length) {
    return null
  }

  return (
    <section data-fs-search-section className={styles.fsSearch}>
      <div data-fs-search-header>
        <p data-fs-search-title>History</p>
        <Button variant="tertiary" onClick={clearSearchHistory}>
          Clear History
        </Button>
      </div>
      <UIList variant="ordered">
        {searchHistory.map((item) => (
          <li key={item.term} data-fs-search-item>
            <Link
              data-fs-search-item-link
              variant="display"
              href={item.path}
              onClick={() => onSearchInputSelection?.(item.term, item.path)}
            >
              <Icon
                name="Clock"
                width={18}
                height={18}
                data-fs-search-item-icon
              />
              <span>{item.term}</span>
            </Link>
          </li>
        ))}
      </UIList>
    </section>
  )
}

export default SearchHistory
