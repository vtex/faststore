import type { PropsWithChildren } from 'react'
import React, { createContext, useMemo } from 'react'

import type { State as SearchState } from '../types'
import type { UseSearchInfiniteState } from './useInfiniteSearchState'
import { useSearchInfiniteState } from './useInfiniteSearchState'
import type { UseSearchState } from './useSearchState'
import { useSearchState } from './useSearchState'

export interface SearchContext extends UseSearchInfiniteState, UseSearchState {
  itemsPerPage: number
}

export const Context = createContext<SearchContext | undefined>(undefined)

type Props = SearchState & {
  onChange: (url: URL) => void
  itemsPerPage: number
}

export const Provider = ({
  children,
  itemsPerPage,
  onChange,
  ...rest
}: PropsWithChildren<Props>) => {
  const { state, ...searchActions } = useSearchState(rest, onChange)
  const { pages, ...infiniteActions } = useSearchInfiniteState(state.page)

  const value = useMemo(
    (): SearchContext => ({
      state,
      ...searchActions,
      pages,
      ...infiniteActions,
      itemsPerPage,
    }),
    [infiniteActions, itemsPerPage, pages, searchActions, state]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
