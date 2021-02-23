import { navigate } from '@reach/router'
import type { SearchFilterItem } from '@vtex/store-ui'

import type { PriceRange } from './priceRange'
import { format } from './priceRange'
import { uniqBy } from '../../utils/uniq'
import type { SearchFilters } from './Provider'

const HISTORY_KEY = 'vtex-search-history'
const MAX_ITEMS = 10

export const history = {
  get: (): string[] => JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]'),
  add: (term: string) => {
    const h = history.get()

    const updatedHistory = uniqBy([term, ...h].slice(0, MAX_ITEMS), (t) => t)

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  },
}

export type SearchHistory = typeof history

export const search = (term: string) => {
  history.add(term)

  navigate(`/${encodeURI(term)}`)
}

export const setSearchFilters = (filters: SearchFilters) => {
  const { search: searchParams } = window.location
  const params = new URLSearchParams(searchParams)

  Object.keys(filters).forEach((key: string) => {
    const value = filters[key as keyof SearchFilters]

    if (key === 'priceRange') {
      params.set(key, format(value as PriceRange))
    } else if (value && !['query', 'selectedFacets'].includes(key)) {
      params.set(key, value as string)
    }
  })

  navigate(`/${filters.query}?${params.toString()}`)
}

// TODO: This function can be moved to the backend if we have a decent graphql layer
export const toggleItem = (item: SearchFilterItem, filters: SearchFilters) => {
  const { selected, value, key } = item
  let { map, query } = filters

  if (selected) {
    const splittedQuery = query?.split('/')
    const splittedMap = map?.split(',')

    const index = splittedQuery?.findIndex((s) => s === value)

    // Unselecting the base path. This is not allowed since it would redirect
    // the user to the home page. In the future we should return a visual
    // feedback for the user
    if (index === 0) {
      return
    }

    // eslint-disable-next-line no-console
    console.assert(
      index !== undefined && index > -1,
      `${value} is marked as selected but does not exist in ${query}`
    )

    splittedQuery?.splice(index!, 1)
    query = splittedQuery?.join('/')

    splittedMap?.splice(index!, 1)
    map = splittedMap?.join(',')
  } else {
    query = `${query!}/${value}`
    map = `${map},${key}`
  }

  setSearchFilters({
    ...filters,
    query,
    map,
  })
}

export const setPriceRange = (priceRange: PriceRange, filters: SearchFilters) =>
  setSearchFilters({
    ...filters,
    priceRange: {
      from: Math.trunc(priceRange.from),
      to: Math.trunc(priceRange.to),
    },
  })
