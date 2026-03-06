import { createStore } from '@faststore/sdk'
import { useEffect, useMemo } from 'react'
import config from 'discovery.config'
import { useStore } from '../useStore'
import { useSession } from '../session'

export type SearchHistoryByLocale = Record<string, History[]>

export const searchHistoryStore = createStore(
  {} as SearchHistoryByLocale,
  `fs::searchHistory`
)

const MAX_HISTORY_SIZE = 4
const DEFAULT_LOCALE = config.localization.enabled
  ? config.localization.defaultLocale
  : config.session.locale

export interface History {
  term: string
  path: string
}

function migrateSearchHistory(value: unknown): SearchHistoryByLocale {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as SearchHistoryByLocale
  }
  if (Array.isArray(value) && value.length > 0) {
    return { [DEFAULT_LOCALE]: value as History[] }
  }
  return {}
}

export default function useSearchHistory(
  maxHistorySize: number = MAX_HISTORY_SIZE
) {
  const locale = useSession()?.locale ?? DEFAULT_LOCALE
  const rawStore = useStore(searchHistoryStore)

  const byLocale = useMemo(() => migrateSearchHistory(rawStore), [rawStore])

  useEffect(() => {
    if (Array.isArray(rawStore)) {
      searchHistoryStore.set(migrateSearchHistory(rawStore))
    }
  }, [rawStore])

  const searchHistory = byLocale[locale] ?? []

  function addToSearchHistory(newHistory: History) {
    const set = new Set<string>()
    const current = byLocale[locale] ?? []
    const newHistoryArray = [newHistory, ...current]
      .filter((item) => !set.has(item.term) && set.add(item.term), set)
      .slice(0, maxHistorySize)

    searchHistoryStore.set({
      ...byLocale,
      [locale]: newHistoryArray,
    })
  }

  function clearSearchHistory() {
    const next = { ...byLocale }
    delete next[locale]
    searchHistoryStore.set(Object.keys(next).length > 0 ? next : {})
  }

  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  }
}
