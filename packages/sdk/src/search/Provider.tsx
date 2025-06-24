import type { PropsWithChildren } from 'react'
import { createContext, useEffect } from 'react'

import type { State as SearchState } from '../types'
import {
  useSearchState,
  type UseSearchState,
} from './global-state/useSearchState'

export interface SearchContext extends UseSearchState {}

export const Context = createContext<SearchContext | undefined>(undefined)

type Props = Partial<
  SearchState & {
    /** @description: Dont use this hook to look/set url changes */
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
  }, [])

  return children
}
