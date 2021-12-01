import React, { createContext, useEffect, useMemo } from 'react'
import type { FC } from 'react'

import { format } from './serializer'
import { useSearchInfiniteState } from './useInfiniteSearchState'
import { useSearchState } from './useSearchState'
import type { UseSearchInfiniteState } from './useInfiniteSearchState'
import type { State as SearchState, UseSearchState } from './useSearchState'

export interface SearchContext extends UseSearchInfiniteState, UseSearchState {
  itemsPerPage: number
}

export const Context = createContext<SearchContext | undefined>(undefined)

type Props = SearchState & {
  onChange: (url: URL) => void
  itemsPerPage: number
}

export const Provider: FC<Props> = ({
  children,
  itemsPerPage,
  onChange,
  ...rest
}) => {
  const { state, ...searchActions } = useSearchState(rest)
  const { pages, ...infiniteActions } = useSearchInfiniteState(state.page)

  useEffect(() => {
    onChange(format(state))
  }, [onChange, state])

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
