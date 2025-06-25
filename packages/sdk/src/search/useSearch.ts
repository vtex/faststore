import type { SearchContext } from './Provider'
import { useSearchState } from './globalState/useSearchState'

export const useSearch = (): SearchContext => {
  const value = useSearchState()

  return value
}
