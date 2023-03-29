import {
  SearchHistory as UISearchHistory,
  SearchHistoryTerm as UISearchHistoryTerm,
  useSearch,
} from '@faststore/ui'
import useSearchHistory from 'src/sdk/search/useSearchHistory'

const SearchHistory = ({ ...props }) => {
  const {
    values: { onSearchSelection },
  } = useSearch()
  const { searchHistory, clearSearchHistory } = useSearchHistory()

  if (!searchHistory.length) {
    return null
  }

  return (
    <UISearchHistory title="History" onClear={clearSearchHistory} {...props}>
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
