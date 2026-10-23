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
 * Cache-only keys that scope gallery pages to the shopper context. They make
 * the local cache comparison (and the SWR key) miss when a page was loaded for
 * another context (e.g. the anonymous SSG page). They are not declared by the
 * operation, so the API ignores them, but they are still sent with the
 * variables, which go in the URL because this query is a GET operation.
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
 *   the last resort. Since the value ends up in the URL, it is hashed so the
 *   raw contract or unit id is not written to access, CDN or RUM logs as is.
 *   The hash is unkeyed: it avoids that incidental exposure, not a deliberate
 *   reversal of a guessable id. The URL still differs per contract, so a
 *   contract page is never served from the anonymous page's cache entry.
 */
const getShopperScope = ({
  postalCode,
  contract,
}: {
  postalCode?: string | null
  contract?: string | null
}) => ({
  ...(isDeliveryPromiseEnabled && { _postalCode: postalCode ?? '' }),
  ...(contract && { _contract: hashContractScope(contract) }),
})

/** The id a B2B session is scoped by, or `null` outside a B2B session. */
const getContractScope = (
  b2b?: { customerId?: string | null; unitId?: string | null } | null
) => (b2b ? b2b.customerId || b2b.unitId || 'b2b' : null)

/**
 * 53-bit string hash (cyrb53): wide enough that two contracts in the same
 * browser never share a cache key in practice, without exposing the raw id.
 */
export function hashContractScope(value: string) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36)
}

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

    // Keyed on the contract id, not the `b2b` object, which is rebuilt on
    // every session update.
    const contract = getContractScope(b2b)
    const localizedVariablesWithRegion = useMemo(
      () => ({
        ...localizedVariables,
        ...getShopperScope({ postalCode, contract }),
      }),
      [localizedVariables, postalCode, contract]
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
