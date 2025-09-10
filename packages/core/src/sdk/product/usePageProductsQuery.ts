import { useSearch } from '@faststore/sdk'
import { gql } from '../../../@generated'
import type {
  ClientManyProductsQueryQuery,
  ClientManyProductsQueryQueryVariables,
} from '../../../@generated/graphql'
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
import { useQuery } from '../graphql/useQuery'
import { generatedBuildTime } from '../../../next-seo.config'
import { useLocalizedVariables } from './useLocalizedVariables'
import { useShouldFetchFirstPage } from './useShouldFetchFirstPage'
import { useSession } from '../session'

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
  query ClientManyProductsQuery(
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
    }
  }
`)

const getKey = (object: any) => JSON.stringify(object)

interface UseCreateUseGalleryPageProps {
  initialPages?: ClientManyProductsQueryQuery
  serverManyProductsVariables?: ClientManyProductsQueryQueryVariables
  searchTerm?: string
}

/**
 * Use this hook for managed pages state and creating useGalleryPage hook that will be used for fetching a list of products per pages in PLP or Search
 */
export const useCreateUseGalleryPage = (
  params?: UseCreateUseGalleryPageProps
) => {
  const { postalCode: sessionPostalCode } = useSession()
  const initialPages = params?.initialPages?.search ? [params.initialPages] : []
  const initialVariables = params?.serverManyProductsVariables
    ? [getKey(params.serverManyProductsVariables)]
    : []

  const [pages, setPages] =
    useState<ClientManyProductsQueryQuery[]>(initialPages)
  // We create pagesRef as a mirror of the pages state so we don't have to add pages as a dependency of the useGalleryPage hook
  const pagesRef = useRef<ClientManyProductsQueryQuery[]>(initialPages)
  const pagesCache = useRef<string[]>(initialVariables)
  const postalCodeRef = useRef<string>(sessionPostalCode)

  const useGalleryPage = useCallback(
    function useGalleryPage(page: number) {
      const {
        state: { sort, term, selectedFacets },
        itemsPerPage,
      } = useSearch()

      const localizedVariables = useLocalizedVariables({
        first: itemsPerPage,
        after: (itemsPerPage * page).toString(),
        sort,
        term: params?.searchTerm ?? term ?? '',
        selectedFacets,
      })

      const hasSameVariables = deepEquals(
        pagesCache.current[page],
        getKey(localizedVariables)
      )

      const shouldFetchFirstPage = useShouldFetchFirstPage({
        page,
        generatedBuildTime,
      })

      const shouldFetch =
        !hasSameVariables || shouldFetchFirstPage || !!sessionPostalCode

      const { data, mutate } = useQuery<
        ClientManyProductsQueryQuery,
        ClientManyProductsQueryQueryVariables
      >(query, localizedVariables, {
        fallbackData: null,
        suspense: true,
        doNotRun: !shouldFetch,
      })

      const shouldUpdatePages = data !== null

      if (shouldUpdatePages) {
        pagesCache.current[page] = getKey(localizedVariables)

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

      // Refetch query with updated regionId
      useEffect(() => {
        if (sessionPostalCode !== postalCodeRef.current) {
          mutate()
          postalCodeRef.current = sessionPostalCode
        }
      }, [sessionPostalCode])

      return useMemo(() => {
        if (hasSameVariables) {
          return { data: pagesRef.current[page] }
        }

        return { data }
      }, [hasSameVariables, data, page])
    },
    [params?.searchTerm, sessionPostalCode]
  )

  return useMemo(
    () => ({
      pages,
      useGalleryPage,
    }),
    [pages, useGalleryPage]
  )
}
