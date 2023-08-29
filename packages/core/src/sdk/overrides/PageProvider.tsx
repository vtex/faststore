import {
  ClientProductGalleryQueryQuery,
  ClientProductQueryQuery,
  ClientProductsQueryQuery,
  ServerCollectionPageQueryQuery,
  ServerProductPageQueryQuery,
} from '@generated/graphql'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { SearchPageContextType } from 'src/pages/s'

export interface ProductDetailsPageContext {
  data?: ServerProductPageQueryQuery &
    ClientProductQueryQuery['product'] & { isValidating?: boolean }
}

export interface ProductListingPageContext {
  data?: ServerCollectionPageQueryQuery &
    ClientProductGalleryQueryQuery & { pages: ClientProductsQueryQuery[] }
}

export interface SearchPageContext {
  data?: SearchPageContextType &
    ClientProductGalleryQueryQuery & { pages: ClientProductsQueryQuery[] }
}

export const isPDP = (x: any): x is ProductDetailsPageContext =>
  x?.data?.product?.sku != undefined && x?.data?.product?.sku != null

export const isPLP = (x: any): x is ProductListingPageContext =>
  x?.data?.collection?.seo != undefined &&
  x?.data?.collection?.seo != null &&
  x?.data?.collection?.sku == undefined

export const isSearchPage = (x: any): x is SearchPageContext =>
  x === undefined ||
  x?.data?.title != undefined ||
  x?.data?.searchTerm != undefined

export interface PageProviderContextValue {
  context?:
    | ProductDetailsPageContext
    | ProductListingPageContext
    | SearchPageContext
}

const PageContext = createContext<PageProviderContextValue | null>(null)

function PageProvider({
  context,
  children,
}: PropsWithChildren<PageProviderContextValue>) {
  const value = useMemo(
    () => ({
      context,
    }),
    [context]
  )

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export function usePage() {
  const { context } = useContext(PageContext)

  if (context == null) {
    throw new Error('Missing Overrides context on React tree')
  }

  if (isPLP(context)) {
    return context as ProductListingPageContext
  } else if (isSearchPage(context)) {
    return context as SearchPageContext
  } else if (isPDP(context)) {
    return context as ProductDetailsPageContext
  }

  return context
}

export const usePDP = () => usePage() as ProductDetailsPageContext

export const usePLP = () => usePage() as ProductListingPageContext

export const useSearchPage = () => usePage() as SearchPageContext

export default PageProvider
