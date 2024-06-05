import { useRouter } from 'next/router'
import { useSearch } from '@faststore/sdk'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'

import type { SearchContentType } from 'src/server/cms'
import type { SearchPageContextType } from 'src/pages/s'

import SearchPage from './SearchPage'

export type SearchWrapperProps = {
  itemsPerPage: number
  searchContentType: SearchContentType
  serverData: SearchPageContextType
}

export default function SearchWrapper({
  itemsPerPage,
  searchContentType,
  serverData,
}: SearchWrapperProps) {
  const router = useRouter()
  const {
    state: { term, sort, selectedFacets },
  } = useSearch()
  const { data: pageProductGalleryData, isValidating } = useProductGalleryQuery(
    {
      term,
      sort,
      itemsPerPage,
      selectedFacets,
    }
  )

  if (isValidating || !pageProductGalleryData) {
    return null
  }

  // Redirect when there are registered Intelligent Search redirects on VTEX Admin
  if (pageProductGalleryData?.redirect?.url) {
    router.replace(pageProductGalleryData?.redirect?.url, null, {
      shallow: true,
    })

    return null
  }

  return (
    <SearchPage
      page={searchContentType}
      data={{ ...serverData, ...pageProductGalleryData }}
    />
  )
}
