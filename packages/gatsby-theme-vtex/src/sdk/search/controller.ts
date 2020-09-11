import { navigate } from '@reach/router'
import { SearchFilterItem } from '@vtex/store-ui'

import { SearchFilters } from './Provider'

export const search = (term: string) => {
  const encoded = encodeURI(term)

  navigate(`/${encoded}`)
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
