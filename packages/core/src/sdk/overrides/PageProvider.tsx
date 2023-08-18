import type { PropsWithChildren } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { ProductListingPageContext } from 'src/components/templates/ProductListingPage/ProductListingPage'
import { ProductDetailsPageContext } from 'src/pages/[slug]/p'
import { SearchPageContext } from 'src/pages/s'

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

interface PageProviderContextValue {
  context?:
    | ProductDetailsPageContext
    | ProductListingPageContext
    | SearchPageContext
}

const SectionContext = createContext<PageProviderContextValue | null>(null)

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

  return (
    <SectionContext.Provider value={value}>{children}</SectionContext.Provider>
  )
}

export function usePage() {
  const { context } = useContext(SectionContext)

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

export function usePDP() {
  const context = usePage()
  return context as ProductDetailsPageContext
}

export function usePLP() {
  const context = usePage()
  return context as ProductListingPageContext
}

export function useSearchPage() {
  const context = usePage()
  return context as SearchPageContext
}

export default PageProvider
