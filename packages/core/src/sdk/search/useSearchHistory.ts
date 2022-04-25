import { useStorage } from '@faststore/sdk'

const storageKey = 'main::store::searchHistory'

const MAX_HISTORY_SIZE = 5

export default function useSearchHistory(
  maxHistorySize: number = MAX_HISTORY_SIZE
) {
  const [searchHistory, setSearchHistory] = useStorage<string[]>(storageKey, [])

  function addToSearchHistory(term: string) {
    const newHistory = [...new Set([term, ...searchHistory])]

    setSearchHistory(
      newHistory.length > maxHistorySize
        ? newHistory.slice(0, maxHistorySize)
        : newHistory
    )
  }

  function clearSearchHistory() {
    setSearchHistory([])
  }

  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  }
}
