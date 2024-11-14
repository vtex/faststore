import { useRouter } from 'next/router'
import { useSearch } from '@faststore/sdk'

import type { SearchContentType } from 'src/server/cms'
import type { SearchPageContextType } from 'src/pages/s'
import { findFacetValue, useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import Section from 'src/components/sections/Section'
import EmptyState from 'src/components/sections/EmptyState'
import ProductGalleryStyles from 'src/components/sections/ProductGallery/section.module.scss'

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

  const hasFuzzy = findFacetValue(selectedFacets, 'fuzzy')

  if(!hasFuzzy) {
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
