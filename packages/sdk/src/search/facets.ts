import { SDKError } from '../utils/error'
import type { Facet, SearchSort } from '../types'

const sortKeys = new Set<SearchSort>([
  'price_desc',
  'price_asc',
  'orders_desc',
  'name_desc',
  'name_asc',
  'release_desc',
  'discount_desc',
  'score_desc',
])

const customSortKeys = new Set<string>()

/**
 * Registers additional `sort` values accepted from the URL (e.g. `?sort=`),
 * matching the keys a store added via a `StoreSort` schema extension and
 * `@faststore/api`'s `customSortMap`. Call once at app setup. Without this,
 * `parseSearchState` throws on any `sort` value outside the built-in set,
 * even when the API itself already supports it.
 */
export const registerCustomSortKeys = (keys: string[]) => {
  for (const key of keys) {
    customSortKeys.add(key)
  }
}

export const isSearchSort = (x: string): x is SearchSort =>
  sortKeys.has(x as any) || customSortKeys.has(x)

export const removeFacet = (facets: Facet[], facet: Facet): Facet[] => {
  const { key, value } = facet

  const index = facets.findIndex((x) => x.key === key && x.value === value)

  if (index < 0) {
    throw new SDKError(`Cannot remove ${value} from search params`)
  }

  return facets.filter((_, it) => it !== index)
}

export const setFacet = (
  facets: Facet[],
  facet: Facet,
  unique?: boolean
): Facet[] => {
  if (unique === true) {
    const index = facets.findIndex((f) => f.key === facet.key)

    if (index > -1) {
      return facets.map((f, it) => (it === index ? facet : f))
    }
  }

  return [...facets, facet]
}

export const toggleFacet = (facets: Facet[], item: Facet, unique?: boolean) => {
  const found = facets.find(
    (facet) => facet.key === item.key && facet.value === item.value
  )

  if (found !== undefined) {
    return removeFacet(facets, item)
  }

  return setFacet(facets, item, unique)
}

export const toggleFacets = (
  facets: Facet[],
  items: Facet[],
  unique?: boolean
) => items.reduce((acc, curr) => toggleFacet(acc, curr, unique), facets)
