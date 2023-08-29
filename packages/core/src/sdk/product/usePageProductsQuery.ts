import { gql } from '@faststore/graphql-utils'
import { useSearch } from '@faststore/sdk'
import {
  ClientProductsQueryQuery,
  ClientProductsQueryQueryVariables,
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

export const useGalleryPage = (page: number) =>
  useContext(UseGalleryPageContext)(page)

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

const getKey = (object: any) => JSON.stringify(object)

/**
 * Use this hook for fetching a list of products for pages like PLP or Search
 */
export const useCreateUseGalleryPage = () => {
  const [pages, setPages] = useState([])
  // We create pagesRef as a mirror of the pages state so we don't have to add pages as a dependency of the useGalleryPage hook
  const pagesRef = useRef([])
  const pagesCache = useRef([])

  const useGalleryPage = useCallback(function useGalleryPage(page: number) {
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

    const hasSameVariables =
      pagesCache.current[page] === getKey(localizedVariables)

    const { data } = useQuery<
      ClientProductsQueryQuery,
      ClientProductsQueryQueryVariables
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
