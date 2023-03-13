import {
  SearchHistory as UISearchHistory,
  SearchHistoryTerm as UISearchHistoryTerm,
} from '@faststore/ui'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSearchInput from 'src/sdk/search/useSearchInput'

const SearchHistory = ({ ...props }) => {
  const { onSearchInputSelection } = useSearchInput()
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
            onClick: () => onSearchInputSelection?.(item.term, item.path),
          }}
        />
      ))}
    </UISearchHistory>
  )
}

export default SearchHistory
