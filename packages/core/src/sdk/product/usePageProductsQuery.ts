import { useSearch } from '@faststore/sdk'
import { gql } from '@generated'
import {
  ClientManyProductsQueryQuery,
  ClientManyProductsQueryQueryVariables,
} from '@generated/graphql'
import {
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
  useMemo,
  useState,
} from 'react'
import { useQuery } from 'src/sdk/graphql/useQuery'
import { useLocalizedVariables } from './useLocalizedVariables'

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
    $fuzzy: String
  ) {
    ...ClientManyProducts
    search(
      first: $first
      after: $after
      sort: $sort
      term: $term
      selectedFacets: $selectedFacets
      fuzzy: $fuzzy
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

/**
 * Use this hook for managed pages state and creating useGalleryPage hook that will be used for fetching a list of products per pages in PLP or Search
 */
export const useCreateUseGalleryPage = () => {
  const [pages, setPages] = useState<ClientManyProductsQueryQuery[]>([])
  // We create pagesRef as a mirror of the pages state so we don't have to add pages as a dependency of the useGalleryPage hook
  const pagesRef = useRef<ClientManyProductsQueryQuery[]>([])
  const pagesCache = useRef<string[]>([])

  const useGalleryPage = useCallback(function useGalleryPage(page: number) {
    const {
      state: { sort, term, selectedFacets, fuzzy },
      itemsPerPage,
    } = useSearch()

    const localizedVariables = useLocalizedVariables({
      first: itemsPerPage,
      after: (itemsPerPage * page).toString(),
      sort,
      term: term ?? '',
      selectedFacets,
      fuzzy,
    })

    const hasSameVariables =
      pagesCache.current[page] === getKey(localizedVariables)

    const { data } = useQuery<
      ClientManyProductsQueryQuery,
      ClientManyProductsQueryQueryVariables
    >(query, localizedVariables, {
      fallbackData: null,
      suspense: true,
      doNotRun: hasSameVariables,
    })

    const shouldUpdatePages = !hasSameVariables && data !== null

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
