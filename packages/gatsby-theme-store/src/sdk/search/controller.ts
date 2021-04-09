import { navigate } from '@reach/router'
import type { SearchFilterItem } from '@vtex/store-ui'

import { slugify } from '../../utils/slugify'
import { uniqBy } from '../../utils/uniq'
import { format } from './priceRange'
import type { SearchFilters } from './Provider'
import type { PriceRange } from './priceRange'

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

const pathExists = async (pathname: string) => {
  try {
    const response = await fetch(`/page-data${pathname}/page-data.json`, {
      redirect: 'error',
    })

    if (response.status !== 200) {
      return false
    }

    return true
  } catch (err) {
    return false
  }
}

/**
 * https://help.vtex.com/en/tutorial/how-does-vtex-search-work--tutorials_542#vtex-search-engine-product-display-prioritization
 *
 * To be compliant with "VTEX search engine product display prioritization" as described in the link above we implement the following
 * algorithm:
 *
 * 1. Make a call to the page's data object.
 * 2. If it exists, this means we Static Site Generated (SSG) a page for this search term and we should navigate there instead
 * 3. If it doesn't exist, we should fallback to a full text search instead
 *
 * This "VTEX search engine product display prioritization" is important because it allows our customers to create landing pages
 * for their most researched terms, crafting a custom experience for their best sellers.
 * A cool side effect of this approach is warming the browser's cache with the page's data object in case of the term having an
 * specific landing page
 */
export const search = async (term: string) => {
  let pathname = ''
  const params = new URLSearchParams(window.location.search)

  // Check if "term" has a more specific page
  const slugified = encodeURIComponent(slugify(term))
  const path = `/${slugified}`
  const exists = await pathExists(path)

  if (exists) {
    // The page /slugified exists, let's navigate to this page
    pathname = `/${slugified}`
  } else {
    // There is no specific page for this term, let's make a full text search
    params.set('map', 'ft')
    pathname = `/s/${encodeURIComponent(term)}`
  }

  history.add(term)

  navigate(`${pathname}?${params.toString()}`)
}

export const setSearchFilters = (filters: SearchFilters) => {
  const { search: searchParams, pathname } = window.location
  const params = new URLSearchParams(searchParams)
  const filterNames = Object.keys(filters) as Array<keyof SearchFilters>

  for (const filter of filterNames) {
    if (filter === 'query' || filter === 'selectedFacets') {
      continue
    }

    let value = filters[filter]

    if (filter === 'priceRange') {
      const v = filters[filter]

      if (v !== null) {
        value = format(v)
      }
    }

    if (typeof value === 'string') {
      params.set(filter, value)
    }
  }

  /**
   * Usually, "filters.query" is the right place to navigate to. However, in landing pages
   * the "filters.query" contains a different value from the page's root path because the
   * business user decides the value of "canonicalPath". This makes us have to always
   * add the root path to the navigation so we never miss the landing page navigation context
   */
  const spath = pathname.split('/').slice(1)
  // TODO: fix filters/query type.
  // Since we stopped sending query and map to searches, the type is nullable,
  // but these values are still used internally.
  // Needs a clearer separation between sent query/map values and internal ones.
  const squery = filters?.query?.split('/') ?? []
  const subIndex = spath.findIndex((path) => squery[0] === path)
  const it = subIndex > -1 ? subIndex : spath.length

  const rootPath = spath.slice(0, it).join('/')
  const path = rootPath ? `${rootPath}/${filters.query}` : filters.query

  navigate(`/${path}?${params.toString()}`)
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

export const setPriceRange = (
  priceRange: PriceRange,
  filters: SearchFilters
) => {
  setSearchFilters({
    ...filters,
    priceRange: {
      from: Math.trunc(priceRange.from),
      to: Math.trunc(priceRange.to),
    },
  })
}
