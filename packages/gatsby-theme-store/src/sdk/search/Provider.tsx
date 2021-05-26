import {
  formatSearchParamsState,
  initSearchParamsState,
  removeSearchParam,
  setSearchParam,
} from '@vtex/store-sdk'
import { navigate } from 'gatsby'
import React, { createContext, useMemo } from 'react'
import type { FC } from 'react'
import type { SearchParamsState } from '@vtex/store-sdk'

import type { ServerSearchPageQueryQuery } from '../../templates/__generated__/ServerSearchPageQuery.graphql'
import type { BrowserSearchPageQueryQuery } from '../../templates/__generated__/BrowserSearchPageQuery.graphql'

type SearchQuery = ServerSearchPageQueryQuery | BrowserSearchPageQueryQuery

export interface SearchContext {
  data: SearchQuery
  searchParams: SearchParamsState
  setFacet: (item: Facet) => void
  toggleFacet: (item: Facet) => void
  toggleFacets: (item: Facet[]) => void
  setSort: (sort: SearchParamsState['sort']) => void
}

export const Context = createContext<SearchContext | undefined>(undefined)

Context.displayName = 'SearchContext'

const apply = (params: SearchParamsState) => {
  const { pathname, search } = formatSearchParamsState(params)

  navigate(`${pathname}${search}`)
}

interface Facet {
  selected?: boolean
  unique?: boolean
  value: string
  key: string
}

const toggleFacet = (item: Facet, state: SearchParamsState) =>
  item.selected === true
    ? removeSearchParam(state, { unique: false, ...item })
    : setSearchParam(state, { unique: false, ...item })

interface Props {
  data: SearchQuery
  searchParams: SearchParamsState
}

export const SearchProvider: FC<Props> = ({
  children,
  searchParams: initalState,
  data,
}) => {
  const value = useMemo(() => {
    const paramsState = initSearchParamsState(initalState)

    return {
      toggleFacet: (item: Facet) => apply(toggleFacet(item, paramsState)),

      toggleFacets: (items: Facet[]) =>
        apply(items.reduce((s, item) => toggleFacet(item, s), paramsState)),

      setFacet: (item: Facet) =>
        apply(setSearchParam(paramsState, { unique: true, ...item })),

      setSort: (sort: SearchParamsState['sort']) =>
        apply(setSearchParam(paramsState, { key: 'sort', value: sort })),

      searchParams: paramsState,

      data,
    }
  }, [initalState, data])

  return <Context.Provider value={value}>{children}</Context.Provider>
}
