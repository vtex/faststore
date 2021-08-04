import { useMemo } from 'react'
import { useLocation } from '@reach/router'
import type { SearchParamsState } from '@vtex/store-sdk'

import { priceRange } from './priceRange'

export interface SelectedFacets {
  key: string
  value: string
}

const sortMap = {
  'price:desc': 'price-desc',
  'price:asc': 'price-asc',
  'orders:desc': 'orders-desc',
  'name:desc': 'name-desc',
  'name:asc': 'name-asc',
  'release:desc': 'release-desc',
  'discount:desc': 'discount-desc',
  '': 'score-desc',
} as const

interface Args {
  selectedFacets: SelectedFacets[]
  sort: string
  itemsPerPage: number
  fullText?: string
  from?: number
}

/**
 * @description: Hydrates search context for static search pages.
 */
export const useSearchParamsFromQueryVariables = (
  pageContext: Args
): SearchParamsState => {
  const { pathname } = useLocation()
  const { selectedFacets, sort, fullText, itemsPerPage } = pageContext
  const from = pageContext.from ?? 0

  if (selectedFacets == null || !Array.isArray(selectedFacets)) {
    throw new Error('Bad SelectedFacets in static search page')
  }

  return useMemo(() => {
    // TODO: Remove this bit of code once we have a graphql layer
    const facets = selectedFacets.reduce((acc, facet) => {
      const { key } = facet
      const value =
        key === 'priceRange'
          ? priceRange.formatUrl(priceRange.parseQuery(facet.value)!)
          : facet.value

      acc.push({ key, value })

      return acc
    }, [] as SearchParamsState['selectedFacets'])

    const [base] = pathname.split(selectedFacets[0].value)

    return {
      page: Math.floor(from / itemsPerPage),
      base,
      selectedFacets: facets,
      term: fullText ?? null,
      personalized: false,
      sort:
        typeof sort === 'string' && sort in sortMap
          ? sortMap[sort as keyof typeof sortMap]
          : 'score-desc',
    }
  }, [from, fullText, itemsPerPage, pathname, selectedFacets, sort])
}
