import { gql } from '@faststore/graphql-utils'
import { useSearch } from '@faststore/sdk'
import {
  ClientProductsQueryQuery,
  ClientProductsQueryQueryVariables,
} from '@generated/graphql'
import { useEffect, useCallback } from 'react'
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
  productsPerPage: ProductsPerPage[] = [],
  page: number,
  data: ClientProductsQueryQuery
) {
  const currentPagedProducts = { page, data }
  // const newProductsPerPage = [...productsPerPage]
  const newProductsPerPage = productsPerPage

  const index = newProductsPerPage.findIndex((item) => item.page === page)
  const shouldReplacePage = index !== -1

  if (shouldReplacePage) {
    newProductsPerPage[index] = currentPagedProducts
  } else {
    newProductsPerPage.push(currentPagedProducts)
    newProductsPerPage.sort((a, b) => a.page - b.page)
  }

  return { productsPerPage: newProductsPerPage, currentPagedProducts }
}

/**
 * Use this hook for fetching a list of products for pages like PLP or Search
 */
export const createUsePage = () => {
  const pages = []

  return function usePage(page) {
    const {
      state: { sort, term, selectedFacets },
      itemsPerPage,
    } = useSearch()

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
      doNotRun: Boolean(pages[page]),
    })

    useEffect(() => {
      pages[page] = data
    }, [data, page])

    return { data }
  }
}
