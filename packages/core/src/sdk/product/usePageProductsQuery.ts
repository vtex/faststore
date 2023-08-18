import { gql } from '@faststore/graphql-utils'
import { useSearch } from '@faststore/sdk'
import {
  ClientProductsQueryQuery,
  ClientProductsQueryQueryVariables,
} from '@generated/graphql'
import { MutableRefObject, useEffect, useRef, useCallback } from 'react'
import type { QueryOptions } from '../graphql/useQuery'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useSWRConfig } from 'swr'
import { prefetchQuery } from '../graphql/prefetchQuery'
import { useLocalizedVariables } from './useLocalizedVariables'
import { ProductsPerPage } from '../overrides/PageProvider'

export const query = gql`
  query ClientProductsQuery(
    $first: Int!
    $after: String
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
  ) {
    ...ClientProducts
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
    ) {
      products {
        pageInfo {
          totalCount
        }
        edges {
          node {
            ...ProductSummary_product
          }
        }
      }
    }
  }
`

export const useProductsQueryPrefetch = (
  variables: ClientProductsQueryQueryVariables,
  options?: QueryOptions
) => {
  const localizedVariables = useLocalizedVariables(variables)
  const { cache } = useSWRConfig()

  return useCallback(
    () => prefetchQuery(query, localizedVariables, { cache, ...options }),
    [localizedVariables, cache, options]
  )
}

export const useProductsPrefetch = (page: number | null) => {
  const {
    itemsPerPage,
    state: { sort, term, selectedFacets },
  } = useSearch()

  const prefetch = useProductsQueryPrefetch({
    first: itemsPerPage,
    after: (itemsPerPage * (page ?? 0)).toString(),
    sort,
    term: term ?? '',
    selectedFacets,
  })

  useEffect(() => {
    if (page !== null) {
      prefetch()
    }
  }, [page, prefetch])
}

function updatesProductsPerPageRef(
  productsPerPageRef: MutableRefObject<ProductsPerPage[]>,
  page: number,
  data: ClientProductsQueryQuery
) {
  const productsPerPage = productsPerPageRef.current
  const currentProductsPerPage = { page, data }

  if (productsPerPage.length === 0) {
    productsPerPage.push(currentProductsPerPage)
    return { productsPerPage, currentProductsPerPage }
  }

  const index = productsPerPage.findIndex((item) => item.page === page)
  const lastItem = productsPerPage[productsPerPage.length - 1]
  const shouldReplaceItem = index !== -1
  const shouldAddNext = page > lastItem.page

  if (shouldReplaceItem) {
    productsPerPage.splice(index, 1, currentProductsPerPage)
  } else if (shouldAddNext) {
    productsPerPage.push(currentProductsPerPage)
  } else {
    productsPerPage.unshift(currentProductsPerPage)
  }
  return { productsPerPage, currentProductsPerPage }
}

/**
 * Use this hook for fetching a list of products for pages like PLP or Search
 */
export const usePageProductsQuery = (
  { page, itemsPerPage, sort, term, selectedFacets },
  initialState: ProductsPerPage[] = []
) => {
  const productsPerPageRef = useRef<ProductsPerPage[]>(initialState)

  const localizedVariables = useLocalizedVariables({
    first: itemsPerPage,
    after: (itemsPerPage * page).toString(),
    sort,
    term: term ?? '',
    selectedFacets,
  })

  const { data } = useQuery<
    ClientProductsQueryQuery,
    ClientProductsQueryQueryVariables
  >(query, localizedVariables, {
    fallbackData: null,
    suspense: true,
  })

  const { productsPerPage, currentProductsPerPage } = updatesProductsPerPageRef(
    productsPerPageRef,
    page,
    data
  )
  return { productsPerPage, currentProductsPerPage }
}
