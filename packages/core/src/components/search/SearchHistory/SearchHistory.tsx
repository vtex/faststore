import {
  SearchHistory as UISearchHistory,
  SearchHistoryTerm as UISearchHistoryTerm,
  useSearch,
} from '@faststore/ui'
import useSearchHistory from 'src/sdk/search/useSearchHistory'

export interface SearchHistoryProps {
  title?: string
  [x: string]: any
}

const SearchHistory = ({ title = 'History', ...props }: SearchHistoryProps) => {
  const {
    values: { onSearchSelection },
  } = useSearch()
  const { searchHistory, clearSearchHistory } = useSearchHistory()

  if (!searchHistory.length) {
    return null
  }

  return (
    <UISearchHistory title={title} onClear={clearSearchHistory} {...props}>
      {searchHistory.map((item) => (
        <UISearchHistoryTerm
          key={item.term}
          value={item.term}
          linkProps={{
            href: item.path,
            onClick: () => onSearchSelection?.(item.term, item.path),
          }}
        />
      ))}
    </UISearchHistory>
  )
}

export default SearchHistory
