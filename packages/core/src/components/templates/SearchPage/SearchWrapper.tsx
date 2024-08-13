import { useSearch } from '@faststore/sdk'
import { useRouter } from 'next/router'

import EmptyState from 'src/components/sections/EmptyState'
import Section from 'src/components/sections/Section'
import type { SearchPageContextType } from 'src/pages/s'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import type { SearchContentType } from 'src/server/cms'

import SearchPage from './SearchPage'

function EmptySearch() {
  return (
    <Section className={`section-product-gallery`}>
      <section data-testid="product-gallery" data-fs-product-listing>
        <EmptyState title="" showLoader />
      </section>
    </Section>
  )
}

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
    return <EmptySearch />
  }

  // Redirect when there are registered Intelligent Search redirects on VTEX Admin
  if (pageProductGalleryData?.redirect?.url) {
    router.replace(pageProductGalleryData?.redirect?.url, null, {
      shallow: true,
    })

    return <EmptySearch />
  }

  return (
    <SearchPage
      page={searchContentType}
      data={{ ...serverData, ...pageProductGalleryData }}
    />
  )
}
