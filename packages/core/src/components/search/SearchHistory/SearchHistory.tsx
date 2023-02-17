import {
  SearchHistory as UISearchHistory,
  SearchHistoryTerm as UISearchHistoryTerm,
} from '@faststore/ui'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSearchInput from 'src/sdk/search/useSearchInput'

const SearchHistory = () => {
  const { onSearchInputSelection } = useSearchInput()
  const { searchHistory, clearSearchHistory } = useSearchHistory()

  if (!searchHistory.length) {
    return null
  }

  return (
    <UISearchHistory title="History" onClearClick={clearSearchHistory}>
      {searchHistory.map((item) => (
        <UISearchHistoryTerm
          value={item.term}
          href={item.path}
          onLinkClick={() => onSearchInputSelection?.(item.term, item.path)}
        />
      ))}
    </UISearchHistory>
  )
}

export default SearchHistory
