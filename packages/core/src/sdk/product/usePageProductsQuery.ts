import { useSearch } from '@faststore/sdk'
import { gql } from '@generated'
import type {
  ClientManyProductsQueryWithSearchIdQuery,
  ClientManyProductsQueryWithSearchIdQueryVariables,
} from '@generated/graphql'
import storeConfig from 'discovery.config'
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

const isDeliveryPromiseEnabled = storeConfig.deliveryPromise?.enabled ?? false

/**
 * Cache-only keys that scope gallery pages to the shopper context. They are not
 * declared by the operation, so the API ignores them; they only make the local
 * cache comparison miss when a page was loaded for another context (e.g. the
 * anonymous SSG page).
 * - `_postalCode`: pages are invalidated on region change. Only applied when
 *   deliveryPromise is enabled to avoid unnecessary cache fragmentation.
 * - `_contract`: the B2B contract assortment is applied server-side from the
 *   session cookie, so it never shows up in the query variables. Keyed off
 *   the presence of a `b2b` session (not `customerId`'s value) because
 *   `customerId` can resolve to an empty string for a legitimate B2B buyer
 *   (see `buildB2bSession` in `@faststore/api`). The fallback chain still
 *   forces the re-fetch for them: the real `customerId`, when present, keeps
 *   invalidating the cache on contract switch; otherwise the organizational
 *   unit (`unitId`) tells buyers of different units apart; a generic marker is
 *   the last resort.
 */
const getShopperScope = ({
  postalCode,
  b2b,
}: {
  postalCode?: string | null
  b2b?: { customerId?: string | null; unitId?: string | null } | null
}) => ({
  ...(isDeliveryPromiseEnabled && { _postalCode: postalCode ?? '' }),
  ...(b2b && { _contract: b2b.customerId || b2b.unitId || 'b2b' }),
})

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

  // Seed the cache with the same key shape that useGalleryPage uses, so
  // hasSameVariables matches on first mount and avoids an unnecessary re-fetch
  // of the SSR-loaded page. The SSG page is built without a buyer, so it is
  // seeded without a contract: B2B buyers re-fetch it with their assortment.
  const { postalCode } = useSession()
  const initialVariables = params?.serverManyProductsVariables
    ? [
        getKey({
          ...params.serverManyProductsVariables,
          ...getShopperScope({ postalCode }),
        }),
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

    const { postalCode, b2b, isValidating: isSessionValidating } = useSession()

    const localizedVariables = useLocalizedVariables({
      first: itemsPerPage,
      after: (itemsPerPage * page).toString(),
      sort,
      term: term ?? '',
      selectedFacets,
    })

    const localizedVariablesWithRegion = useMemo(
      () => ({
        ...localizedVariables,
        ...getShopperScope({ postalCode, b2b }),
      }),
      [localizedVariables, postalCode, b2b]
    )

    const hasSameVariables = deepEquals(
      pagesCache.current[page],
      getKey(localizedVariablesWithRegion)
    )

    const shouldFetchFirstPage = useShouldFetchFirstPage({
      page,
    })

    const shouldFetch = !hasSameVariables || shouldFetchFirstPage

    const { data } = useQuery<
      ClientManyProductsQueryWithSearchIdQuery,
      ClientManyProductsQueryWithSearchIdQueryVariables
    >(query, localizedVariablesWithRegion, {
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
