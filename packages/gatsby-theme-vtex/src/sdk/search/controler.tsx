import { navigate } from '@reach/router'

import { SearchFilters } from './Provider'

export const setSearchFilters = (filters: SearchFilters) => {
  const { search, pathname } = window.location
  const params = new URLSearchParams(search)

  Object.keys(filters).forEach((key: string) => {
    const value = filters[key as keyof SearchFilters]

    if (value && key !== 'query') {
      params.set(key, value)
    }
  })
  const to = `${pathname}?${params.toString()}`

  navigate(to)
}
