import type { SearchContext } from './Provider'
import { useSearchState } from './global-state/useSearchState'

export const useSearch = (): SearchContext => {
  const value = useSearchState()

  return value
}
