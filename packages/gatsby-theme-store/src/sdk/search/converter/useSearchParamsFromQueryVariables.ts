import { useMemo } from 'react'
import { useLocation } from '@reach/router'
import type { SearchParamsState } from '@vtex/store-sdk'

import { priceRange } from './priceRange'
import type { SearchPageProps } from '../../../pages/{StoreCollection.slug}'

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

/**
 * @description: Hydrates search context for static search pages.
 */
export const useSearchParamsFromQueryVariables = (
  pageContext: SearchPageProps['pageContext']
): SearchParamsState => {
  const { pathname } = useLocation()
  const { selectedFacets, orderBy, fullText, pageInfo } = pageContext
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
      page: Math.floor(from / pageInfo.size),
      base,
      selectedFacets: facets,
      term: fullText ?? null,
      personalized: false,
      sort:
        typeof orderBy === 'string' && orderBy in sortMap
          ? sortMap[orderBy as keyof typeof sortMap]
          : 'score-desc',
    }
  }, [from, pageInfo, fullText, orderBy, pathname, selectedFacets])
}
