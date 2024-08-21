import { useSearch } from '@faststore/sdk'
import type { ServerCollectionPageQueryQuery } from '@generated/graphql'
import deepmerge from 'deepmerge'
import ScrollToTopButton from 'src/components/sections/ScrollToTopButton'
import { ITEMS_PER_PAGE } from 'src/constants'

import RenderSections from 'src/components/cms/RenderSections'
import { PLPContentType } from 'src/server/cms/plp'

import COMPONENTS from 'src/components/cms/plp/Components'
import PageProvider, { PLPContext } from 'src/sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery
  page: PLPContentType
  globalSections?: Array<{ name: string; data: any }>
}

// Array merging strategy from deepmerge that makes client arrays overwrite server array
// https://www.npmjs.com/package/deepmerge
const overwriteMerge = (_: any[], sourceArray: any[]) => sourceArray

export default function ProductListing({
  page: { sections, settings },
  data: server,
  globalSections,
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
          <RenderSections
            sections={sections}
            globalSections={globalSections}
            components={COMPONENTS}
          />
        </UseGalleryPageContext.Provider>
      </PageProvider>

      <ScrollToTopButton />
    </>
  )
}
