import { useMemo } from 'react'
import type { SearchParamsState } from '@vtex/store-sdk'

import { useRegion } from '../../region/useRegion'
import type { BrowserSearchPageQueryQueryVariables } from '../../../templates/__generated__/BrowserSearchPageQuery.graphql'
import type { ServerSearchPageQueryQueryVariables } from '../../../templates/__generated__/ServerSearchPageQuery.graphql'
import { priceRange } from './priceRange'

type QueryParamsFromSearch = Omit<
  BrowserSearchPageQueryQueryVariables | ServerSearchPageQueryQueryVariables,
  'hideUnavailableItems'
>

const sortMap = {
  'price-desc': 'price:desc',
  'price-asc': 'price:asc',
  'orders-desc': 'orders:desc',
  'name-desc': 'name:desc',
  'name-asc': 'name:asc',
  'release-desc': 'release:desc',
  'discount-desc': 'discount:desc',
  'score-desc': '',
} as const

export const useQueryVariablesFromSearchParams = (
  params: SearchParamsState
): QueryParamsFromSearch => {
  const { regionId } = useRegion()

  return useMemo(() => {
    const selectedFacets = params.selectedFacets.reduce((acc, facet) => {
      const { key } = facet
      const value =
        key === 'priceRange'
          ? priceRange.formatQuery(priceRange.parseUrl(facet.value)!)
          : facet.value

      acc.push({ key, value })

      return acc
    }, [] as Vtex_SelectedFacetInput[])

    const queryParams = {
      fullText: params.term ?? undefined,
      selectedFacets,
      orderBy: sortMap[params.sort],
    }

    if (regionId != null) {
      queryParams.selectedFacets.push({
        key: 'region-id',
        value: regionId,
      })
    }

    return queryParams
  }, [params, regionId])
}
