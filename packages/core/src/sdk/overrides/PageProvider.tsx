import {
  ClientProductGalleryQueryQuery,
  ClientSingleProductQueryQuery,
  ClientMultipleProductsQueryQuery,
  ServerCollectionPageQueryQuery,
  ServerProductPageQueryQuery,
} from '@generated/graphql'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { SearchPageContextType } from 'src/pages/s'

export interface PDPContext {
  data?: ServerProductPageQueryQuery &
    ClientSingleProductQueryQuery['product'] & { isValidating?: boolean }
}

export interface PLPContext {
  data?: ServerCollectionPageQueryQuery &
    ClientProductGalleryQueryQuery & {
      pages: ClientMultipleProductsQueryQuery[]
    }
}

export interface SearchPageContext {
  data?: SearchPageContextType &
    ClientProductGalleryQueryQuery & {
      pages: ClientMultipleProductsQueryQuery[]
    }
}

export const isPDP = (x: any): x is PDPContext =>
  x?.data?.product?.sku != undefined && x?.data?.product?.sku != null

export const isPLP = (x: any): x is PLPContext =>
  x?.data?.collection?.seo != undefined &&
  x?.data?.collection?.seo != null &&
  x?.data?.collection?.sku == undefined

export const isSearchPage = (x: any): x is SearchPageContext =>
  x === undefined ||
  x?.data?.title != undefined ||
  x?.data?.searchTerm != undefined

export interface PageProviderContextValue {
  context?: PDPContext | PLPContext | SearchPageContext
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

export function usePage<
  T extends PLPContext | SearchPageContext | PDPContext
>(): T {
  const { context } = useContext(PageContext)

  if (context == null) {
    throw new Error('Missing Overrides context on React tree')
  }

  return context as T
}

export const usePDP = () => usePage<PDPContext>()

export const usePLP = () => usePage<PLPContext>()

export const useSearchPage = () => usePage<SearchPageContext>()

export default PageProvider
