import { useStorage } from '@faststore/sdk'

const storageKey = 'main::store::searchHistory'

const MAX_HISTORY_SIZE = 4

export interface History {
  term: string
  path: string
}

export default function useSearchHistory(
  history: History[] = [],
  maxHistorySize: number = MAX_HISTORY_SIZE
) {
  const [searchHistory, setSearchHistory] = useStorage<History[]>(
    storageKey,
    history
  )

  function addToSearchHistory(newHistory: History) {
    const set = new Set<string>()
    const newHistoryArray = [newHistory, ...searchHistory]
      .slice(0, maxHistorySize)
      .filter((item) => !set.has(item.term) && set.add(item.term), set)

    setSearchHistory(newHistoryArray)
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
