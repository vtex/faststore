import { useEffect, useRef } from 'react'
import { useSearch } from '@faststore/sdk'
import { useRouter } from 'next/router'

import storeConfig from 'discovery.config'
import type { SearchPageContextType } from 'src/pages/s'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import type { SearchContentType } from 'src/server/cms'

import RenderSections from 'src/components/cms/RenderSections'
import PageProvider from 'src/sdk/overrides/PageProvider'
import EmptySearch from './EmptySearch'
import SearchPage from './SearchPage'

export type SearchWrapperProps = {
  itemsPerPage: number
  searchContentType: SearchContentType
  serverData: SearchPageContextType
  globalSections?: Array<{ name: string; data: any }>
  globalSettings?: Record<string, unknown>
}

export default function SearchWrapper({
  itemsPerPage,
  searchContentType,
  serverData,
  globalSections,
  globalSettings,
}: SearchWrapperProps) {
  const router = useRouter()
  const {
    state: { term, sort, selectedFacets },
    pages,
    resetInfiniteScroll,
  } = useSearch()

  const { data: pageProductGalleryData } = useProductGalleryQuery({
    term: term!,
    sort,
    itemsPerPage,
    selectedFacets,
  })

  const redirectUrl = pageProductGalleryData?.redirect?.url
  const lastRedirectedUrl = useRef<string | null>(null)

  // Intelligent Search redirects must run in an effect — calling router.replace
  // during render re-fires on every state update (e.g. scrollRestoration's
  // resetInfiniteScroll) and loops until the tab hangs.
  useEffect(() => {
    if (!redirectUrl || lastRedirectedUrl.current === redirectUrl) return

    lastRedirectedUrl.current = redirectUrl
    void router.replace(redirectUrl)
  }, [redirectUrl, router])

  const emptySearchProps = storeConfig.experimental.enableSearchSSR
    ? {
        title: storeConfig.seo.search.bodyH1 ?? 'Showing results for:',
        term: serverData.searchTerm,
      }
    : {}

  if (!pageProductGalleryData) {
    return (
      <PageProvider context={{ globalSettings }}>
        <RenderSections globalSections={globalSections}>
          <EmptySearch {...emptySearchProps} />
        </RenderSections>
      </PageProvider>
    )
  }

  // Redirect when there are registered Intelligent Search redirects on VTEX Admin
  if (redirectUrl) {
    return (
      <PageProvider context={{ globalSettings }}>
        <RenderSections globalSections={globalSections}>
          <EmptySearch {...emptySearchProps} />
        </RenderSections>
      </PageProvider>
    )
  }

  const productGalleryProducts = pageProductGalleryData?.search?.products
  const stateTotalPages = pages.length
  const searchTotalPages = Math.ceil(
    productGalleryProducts?.pageInfo?.totalCount / itemsPerPage
  )

  // if the total pages is less than the current state total pages, reset the infinite scroll
  if (searchTotalPages > 0 && searchTotalPages < stateTotalPages) {
    resetInfiniteScroll(0)
  }

  return (
    <SearchPage
      page={searchContentType}
      data={{ ...serverData, ...pageProductGalleryData }}
      globalSections={globalSections}
      globalSettings={globalSettings}
    />
  )
}
