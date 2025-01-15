import { useSearch } from '@faststore/sdk'
import { useRouter } from 'next/router'

import EmptyState from 'src/components/sections/EmptyState'
import ProductGalleryStyles from 'src/components/sections/ProductGallery/section.module.scss'
import Section from 'src/components/sections/Section'
import type { SearchPageContextType } from 'src/pages/s'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import type { SearchContentType } from 'src/server/cms'

import SearchPage from './SearchPage'

function EmptySearch() {
  return (
    <Section
      className={`${ProductGalleryStyles.section} section-product-gallery`}
    >
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
  globalSections?: Array<{ name: string; data: any }>
}

export default function SearchWrapper({
  itemsPerPage,
  searchContentType,
  serverData,
  globalSections,
}: SearchWrapperProps) {
  const router = useRouter()
  const {
    state: { term, sort, selectedFacets },
    pages,
    resetInfiniteScroll,
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
    />
  )
}
