import { useGlobalSearchState as useSearch } from '@faststore/sdk'
import { useRouter } from 'next/router'

import type { SearchPageContextType } from 'src/pages/s'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import type { SearchContentType } from 'src/server/cms'
import storeConfig from 'discovery.config'

import RenderSections from 'src/components/cms/RenderSections'
import EmptySearch from './EmptySearch'
import SearchPage from './SearchPage'

export type SearchWrapperProps = {
  itemsPerPage: number
  searchContentType: SearchContentType
  serverData: SearchPageContextType
  globalSections?: Array<{ name: string; data: any }>
  globalSectionsSettings?: Record<string, any>
}

export default function SearchWrapper({
  itemsPerPage,
  searchContentType,
  serverData,
  globalSections,
  globalSectionsSettings,
}: SearchWrapperProps) {
  const router = useRouter()
  const {
    state: { term, sort, selectedFacets },
    pages,
    resetInfiniteScroll,
  } = useSearch()

  const { data: pageProductGalleryData } = useProductGalleryQuery({
    term,
    sort,
    itemsPerPage,
    selectedFacets,
  })

  const emptySearchProps = storeConfig.experimental.enableSearchSSR
    ? {
        title: storeConfig.seo.search.bodyH1 ?? 'Showing results for:',
        term: serverData.searchTerm,
      }
    : {}

  if (!pageProductGalleryData) {
    return (
      <RenderSections globalSections={globalSections}>
        <EmptySearch {...emptySearchProps} />
      </RenderSections>
    )
  }

  // Redirect when there are registered Intelligent Search redirects on VTEX Admin
  if (pageProductGalleryData?.redirect?.url) {
    router.replace(pageProductGalleryData?.redirect?.url, null, {
      shallow: true,
    })

    return (
      <RenderSections globalSections={globalSections}>
        <EmptySearch {...emptySearchProps} />
      </RenderSections>
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
      globalSectionsSettings={globalSectionsSettings}
    />
  )
}
