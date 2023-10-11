import { useSearch } from '@faststore/sdk'
import type { ComponentType } from 'react'

import Breadcrumb from 'src/components/sections/Breadcrumb'
import ProductGallery from 'src/components/sections/ProductGallery'
import { ITEMS_PER_PAGE } from 'src/constants'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import RenderSections from 'src/components/cms/RenderSections'
import { SearchContentType } from 'src/server/cms'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import PageProvider, { SearchPageContext } from 'src/sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import { SearchPageContextType } from 'src/pages/s'

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Breadcrumb,
  ProductGallery,
  ...CUSTOM_COMPONENTS,
}

export type SearchPageProps = {
  data: SearchPageContextType
  page: SearchContentType
}

function SearchPage({
  page: { sections, settings },
  data: server,
}: SearchPageProps) {
  const {
    state: { sort, term, selectedFacets },
  } = useSearch()
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  const { data: pageProductGalleryData } = useProductGalleryQuery({
    term,
    sort,
    selectedFacets,
    itemsPerPage,
  })

  const { pages, useGalleryPage } = useCreateUseGalleryPage()

  const context = {
    data: {
      ...server,
      ...pageProductGalleryData,
      pages,
    },
  } as SearchPageContext

  return (
    <>
      {/*
          WARNING: Do not import or render components from any
          other folder than '../components/sections' in here.

          This is necessary to keep the integration with the CMS
          easy and consistent, enabling the change and reorder
          of elements on this page.

          If needed, wrap your component in a <Section /> component
          (not the HTML tag) before rendering it here.
        */}
      <PageProvider context={context}>
        <UseGalleryPageContext.Provider value={useGalleryPage}>
          <RenderSections sections={sections} components={COMPONENTS} />
        </UseGalleryPageContext.Provider>
      </PageProvider>
    </>
  )
}

export default SearchPage
