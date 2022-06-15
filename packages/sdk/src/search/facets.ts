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

export const isSearchSort = (x: string): x is SearchSort =>
  sortKeys.has(x as any)

export const removeFacet = (facets: Facet[], facet: Facet): Facet[] => {
  const { value } = facet

  const index = facets.findIndex((x) => x.value === value)

  if (index < 0) {
    throw new SDKError(`Cannot remove ${value} from search params`)
  }

  return facets.filter((_, it) => it === 0 || it !== index)
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

export const toggleFacet = (facets: Facet[], item: Facet) => {
  const found = facets.find(
    (facet) => facet.key === item.key && facet.value === item.value
  )

  if (found !== undefined) {
    return removeFacet(facets, item)
  }

  return setFacet(facets, item, false)
}

export const toggleFacets = (facets: Facet[], items: Facet[]) =>
  items.reduce((acc, curr) => toggleFacet(acc, curr), facets)
