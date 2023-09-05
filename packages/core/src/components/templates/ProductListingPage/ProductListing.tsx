import type { ServerCollectionPageQueryQuery } from '@generated/graphql'
import Breadcrumb from 'src/components/sections/Breadcrumb'
import Hero from 'src/components/sections/Hero'
import ProductGallery from 'src/components/sections/ProductGallery'
import ProductShelf from 'src/components/sections/ProductShelf'
import ScrollToTopButton from 'src/components/sections/ScrollToTopButton'
import { ITEMS_PER_PAGE } from 'src/constants'
import deepmerge from 'deepmerge'
import { useSearch } from '@faststore/sdk'

import type { ComponentType } from 'react'
import RenderSections from 'src/components/cms/RenderSections'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import { PLPContentType } from 'src/server/cms'

import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import PageProvider, { PLPContext } from 'src/sdk/overrides/PageProvider'

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery
  page: PLPContentType
}

/**
 * Sections: Components imported from each store's custom components and '../components/sections' only.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Breadcrumb,
  Hero,
  ProductGallery,
  ProductShelf,
  ...CUSTOM_COMPONENTS,
}

// Array merging strategy from deepmerge that makes client arrays overwrite server array
// https://www.npmjs.com/package/deepmerge
const overwriteMerge = (_, sourceArray) => sourceArray

export default function ProductListing({
  page: { sections, settings },
  data: server,
}: ProductListingPageProps) {
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
      ...deepmerge(
        { ...server },
        { ...pageProductGalleryData },
        { arrayMerge: overwriteMerge }
      ),
      pages,
    },
  } as PLPContext

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

      <ScrollToTopButton />
    </>
  )
}
