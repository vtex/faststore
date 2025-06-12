import { type UseSearchState, useSearchState } from './useSearchState'
import {
  type UseSearchInfiniteState,
  useSearchInfiniteState,
} from './useInfiniteSearchState'
import { useMemo } from 'react'

export interface SearchContext extends UseSearchInfiniteState, UseSearchState {
  itemsPerPage: number
}

export const useSearch = () => {
  const state = useSearchState((state) => state)
  const itemsPerPage = useSearchState.use.itemsPerPage()

  const infiniteState = useSearchInfiniteState(state.page)

  return useMemo(() => {
    const { pages, ...infiniteActions } = infiniteState
    return {
      state,
      pages,
      ...infiniteActions,
      itemsPerPage,
    }
  }, [state, infiniteState])
}
