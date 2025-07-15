import type {
  ClientManyProductsQueryQuery,
  ClientProductGalleryQueryQuery,
  ClientProductQueryQuery,
  ServerCollectionPageQueryQuery,
  ServerProductQueryQuery,
} from '@generated/graphql'
import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { SearchPageContextType } from 'src/pages/s'

interface PageGlobalContext {
  globalSettings?: Record<string, unknown>
}

export interface PDPContext extends PageGlobalContext {
  data?: ServerProductQueryQuery &
    ClientProductQueryQuery['product'] & { isValidating?: boolean }
  globalSectionsSettings?: Record<string, any>
}

export interface PLPContext extends PageGlobalContext {
  data?: ServerCollectionPageQueryQuery &
    ClientProductGalleryQueryQuery & {
      pages: ClientManyProductsQueryQuery[]
    }
  globalSectionsSettings?: Record<string, any>
}

export interface SearchPageContext extends PageGlobalContext {
  data?: SearchPageContextType &
    ClientProductGalleryQueryQuery & {
      pages: ClientManyProductsQueryQuery[]
    }
  globalSectionsSettings?: Record<string, any>
}

export interface DynamicContent<T> extends PageGlobalContext {
  data?: T
  globalSectionsSettings?: Record<string, any>
}

export interface PageProviderContextValue {
  context?: PageProviderContext
}

type PageProviderContext =
  | PageGlobalContext
  | PDPContext
  | PLPContext
  | SearchPageContext
  | DynamicContent<unknown>

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

export function usePage<T extends PageProviderContext>(): T {
  const { context } = useContext(PageContext)

  if (context == null) {
    throw new Error('Missing Overrides context on React tree')
  }

  return context as T
}

export const usePDP = () => usePage<PDPContext>()

export const usePLP = () => usePage<PLPContext>()

export const useSearchPage = () => usePage<SearchPageContext>()

export const useDynamicContent = <T,>() => usePage<DynamicContent<T>>()

export default PageProvider
