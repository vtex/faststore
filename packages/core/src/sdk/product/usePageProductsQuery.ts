import storeConfig from 'discovery.config'
import { useSearch } from '@faststore/sdk'
import { gql } from '@generated'
import type {
  ClientManyProductsQueryWithSearchIdQuery,
  ClientManyProductsQueryWithSearchIdQueryVariables,
} from '@generated/graphql'
import deepEquals from 'fast-deep-equal'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useSession } from 'src/sdk/session'
import { generatedBuildTime } from '../../../next-seo.config'
import { useLocalizedVariables } from './useLocalizedVariables'
import { useShouldFetchFirstPage } from './useShouldFetchFirstPage'

export const UseGalleryPageContext = createContext<
  ReturnType<typeof useCreateUseGalleryPage>['useGalleryPage']
>((_: number) => {
  return { data: null }
})

export const useGalleryPage = (page: number) => {
  const useGalleryPageCallback = useContext(UseGalleryPageContext)
  if (!useGalleryPageCallback) {
    throw new Error('Missing UseGalleryPageContext on React tree')
  }
  return useGalleryPageCallback(page)
}

export const query = gql(`
  query ClientManyProductsQueryWithSearchId(
    $first: Int!
    $after: String
    $sort: StoreSort!
    $term: String!
    $selectedFacets: [IStoreSelectedFacet!]!
    $sponsoredCount: Int
  ) {
    ...ClientManyProducts
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      sponsoredCount: $sponsoredCount
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
      searchId
    }
  }
`)

const getKey = (object: any) => JSON.stringify(object)

interface UseCreateUseGalleryPageProps {
  initialPages: ClientManyProductsQueryWithSearchIdQuery
  serverManyProductsVariables: ClientManyProductsQueryWithSearchIdQueryVariables
}

/**
 * Use this hook for managed pages state and creating useGalleryPage hook that will be used for fetching a list of products per pages in PLP or Search
 */
export const useCreateUseGalleryPage = (
  params?: UseCreateUseGalleryPageProps
) => {
  const initialPages = params?.initialPages?.search ? [params.initialPages] : []

  // Seed the cache with the same region-aware key shape that useGalleryPage uses,
  // so hasSameVariables correctly matches on first mount and avoids an unnecessary
  // re-fetch of the SSR-loaded page.
  const isDeliveryPromiseEnabled = storeConfig.deliveryPromise?.enabled ?? false
  const { postalCode } = useSession()
  const initialVariables = params?.serverManyProductsVariables
    ? [
        getKey(
          isDeliveryPromiseEnabled
            ? {
                ...params.serverManyProductsVariables,
                _postalCode: postalCode ?? '',
              }
            : params.serverManyProductsVariables
        ),
      ]
    : []

  const [pages, setPages] =
    useState<ClientManyProductsQueryWithSearchIdQuery[]>(initialPages)
  // We create pagesRef as a mirror of the pages state so we don't have to add pages as a dependency of the useGalleryPage hook
  const pagesRef =
    useRef<ClientManyProductsQueryWithSearchIdQuery[]>(initialPages)
  const pagesCache = useRef<string[]>(initialVariables)

  const useGalleryPage = useCallback(function useGalleryPage(page: number) {
    const {
      state: { sort, term, selectedFacets },
      itemsPerPage,
    } = useSearch()

    const { postalCode, isValidating: isSessionValidating } = useSession()

    const localizedVariables = useLocalizedVariables({
      first: itemsPerPage,
      after: (itemsPerPage * page).toString(),
      sort,
      term: term ?? '',
      selectedFacets,
    })

    // Include postalCode in the cache key so pages are invalidated on region change.
    // _postalCode is not sent to the API — it only affects the local cache comparison.
    // Only applied when deliveryPromise is enabled to avoid unnecessary cache fragmentation.
    const localizedVariablesWithRegion = useMemo(
      () =>
        isDeliveryPromiseEnabled
          ? { ...localizedVariables, _postalCode: postalCode ?? '' }
          : localizedVariables,
      [localizedVariables, postalCode]
    )

    const hasSameVariables = deepEquals(
      pagesCache.current[page],
      getKey(localizedVariablesWithRegion)
    )

    const shouldFetchFirstPage = useShouldFetchFirstPage({
      page,
      generatedBuildTime,
    })

    const shouldFetch = !hasSameVariables || shouldFetchFirstPage

    const { data } = useQuery<
      ClientManyProductsQueryWithSearchIdQuery,
      ClientManyProductsQueryWithSearchIdQueryVariables
    >(query, localizedVariables, {
      fallbackData: null,
      suspense: true,
      doNotRun:
        !shouldFetch || (isDeliveryPromiseEnabled && isSessionValidating),
    })

    const shouldUpdatePages = data !== null

    if (shouldUpdatePages) {
      pagesCache.current[page] = getKey(localizedVariablesWithRegion)

      // Update refs
      const newPages = [...pagesRef.current]
      newPages[page] = data
      pagesRef.current = newPages
    }

    // Prevents error: Cannot update a component (`ProductListing`) while rendering a different component (`ProductGalleryPage`).
    useEffect(() => {
      if (shouldUpdatePages) {
        // Update state
        setPages((oldPages) => {
          const newPages = [...oldPages]
          newPages[page] = data
          return newPages
        })
      }
    }, [data, page, shouldUpdatePages])

    return useMemo(() => {
      if (hasSameVariables) {
        return { data: pagesRef.current[page] }
      }

      return { data }
    }, [hasSameVariables, data, page])
  }, [])

  return useMemo(
    () => ({
      pages,
      useGalleryPage,
    }),
    [pages, useGalleryPage]
  )
}
