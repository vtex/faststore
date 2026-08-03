import type { PropsWithChildren } from 'react'
import React, { createContext, useEffect, useMemo } from 'react'

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
    shouldResetInfiniteScroll?: boolean
  }
>

export const Provider = ({
  children,
  itemsPerPage,
  onChange,
  shouldResetInfiniteScroll,
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
  }, [rest.term, rest.sort, rest.selectedFacets, rest.page])

  // Stable, content-based key for the search "content" (term/sort/facets).
  // `parseSearchState` produces a new `selectedFacets` array on every URL parse
  // even when the content hasn't changed, so we cannot rely on referential
  // equality to gate the infinite scroll reset.
  const searchContentKey = useMemo(
    () =>
      JSON.stringify({
        term: rest.term ?? null,
        sort: rest.sort ?? null,
        selectedFacets: rest.selectedFacets ?? [],
      }),
    [rest.term, rest.sort, rest.selectedFacets]
  )

  useEffect(() => {
    if (shouldResetInfiniteScroll) {
      globalSearchStateValue.resetInfiniteScroll(rest.page ?? 0)
    }
    // `rest.page` is intentionally excluded from deps: the reset must happen
    // only when the search content (term/sort/facets) changes, not when the
    // URL `?page=` changes alone (e.g., when the Sentinel reflects the page
    // currently in viewport). The value read here is the latest at the moment
    // the effect runs, which matches the intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchContentKey, shouldResetInfiniteScroll])

  return <>{children}</>
}
