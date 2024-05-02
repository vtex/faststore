import { createStore } from '@faststore/sdk'

import { useStore } from '../useStore'

export const searchHistoryStore = createStore(
  [] as History[],
  `fs::searchHistory`
)

const MAX_HISTORY_SIZE = 4

export interface History {
  term: string
  path: string
}

export default function useSearchHistory(
  maxHistorySize: number = MAX_HISTORY_SIZE
) {
  const searchHistory = useStore(searchHistoryStore)

  function addToSearchHistory(newHistory: History) {
    const set = new Set<string>()
    const newHistoryArray = [newHistory, ...searchHistory]
      .slice(0, maxHistorySize)
      .filter((item) => !set.has(item.term) && set.add(item.term), set)

    searchHistoryStore.set(newHistoryArray)
  }

  function clearSearchHistory() {
    searchHistoryStore.set([])
  }

  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  }
}
