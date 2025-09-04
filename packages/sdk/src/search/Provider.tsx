import type { PropsWithChildren } from 'react'
import React, { createContext, useEffect } from 'react'

import type { State as SearchState } from '../types'
import {
  useSearchState,
  type UseSearchState,
} from './globalState/useSearchState'

export interface SearchContext extends UseSearchState {}

export const Context = createContext<SearchContext | undefined>(undefined)

type Props = Partial<
  SearchState & {
    onChange?: (url: URL) => void
    itemsPerPage?: number
  }
>

export const Provider = ({
  children,
  itemsPerPage,
  onChange,
  ...rest
}: PropsWithChildren<Props>) => {
  const globalSearchStateValue = useSearchState()

  useEffect(() => {
    return useSearchState.subscribe(() => {
      onChange?.(globalSearchStateValue.serializedState())
    })
  }, [onChange])

  useEffect(() => {
    const { itemsPerPage: stateItemsPerPage } = useSearchState.getState()
    itemsPerPage &&
      itemsPerPage !== stateItemsPerPage &&
      globalSearchStateValue.setItemsPerPage(itemsPerPage)
  }, [itemsPerPage])

  useEffect(() => {
    globalSearchStateValue.setState(rest)
    globalSearchStateValue.resetInfiniteScroll(rest.page ?? 0)
  }, [rest.term, rest.sort, rest.selectedFacets, rest.page])

  return <>{children}</>
}
