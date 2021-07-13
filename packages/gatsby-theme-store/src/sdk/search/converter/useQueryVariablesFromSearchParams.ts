/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useMemo } from 'react'
import type { SearchParamsState } from '@vtex/store-sdk'

import { useRegion } from '../../region/useRegion'
import { priceRange } from './priceRange'
import type { BrowserCollectionPageQueryQueryVariables } from '../../../{StoreCollection.slug}/__generated__/BrowserCollectionPageQuery.graphql'
import type { ServerCollectionPageQueryQueryVariables } from '../../../{StoreCollection.slug}/__generated__/ServerCollectionPageQuery.graphql'

type QueryParamsFromSearch = Omit<
  | BrowserCollectionPageQueryQueryVariables
  | ServerCollectionPageQueryQueryVariables,
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
  params: SearchParamsState,
  pageInfo: { size: number }
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
      from: params.page * pageInfo.size,
      // Search API is inclusive. This removes the last product
      to: (params.page + 1) * pageInfo.size - 1,
    }

    if (regionId != null) {
      queryParams.selectedFacets.push({
        key: 'region-id',
        value: regionId,
      })
    }

    return queryParams
  }, [params, regionId, pageInfo])
}
