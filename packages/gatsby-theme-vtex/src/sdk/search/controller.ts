import { navigate } from '@reach/router'
import { SearchFilterItem } from '@vtex/store-ui'

import { uniqBy } from '../../utils/uniq'
import { SearchFilters } from './Provider'

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

    if (value && key !== 'query' && key !== 'selectedFacets') {
      params.set(key, value)
    }
  })
  const to = `/${filters.query}?${params.toString()}`

  navigate(to)
}

// TODO: This function can be moved to the backend if we have a decent graphql layer
export const toggleItem = (item: SearchFilterItem, filters: SearchFilters) => {
  const { selected, value, key } = item
  let { map, query } = filters

  if (selected) {
    const splittedQuery = query?.split('/')
    const splittedMap = map?.split(',')

    const index = splittedQuery?.findIndex((s) => s === value)

    // eslint-disable-next-line no-console
    console.assert(
      index && index > -1,
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
