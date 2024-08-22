import { useSearch } from '@faststore/sdk'
import type {
  ClientManyProductsQueryQuery,
  ServerCollectionPageQueryQuery,
} from '@generated/graphql'
import deepmerge from 'deepmerge'
import { ITEMS_PER_PAGE } from 'src/constants'

import RenderSections, {
  LazyLoadingSection,
} from 'src/components/cms/RenderSections'
import { PLPContentType } from 'src/server/cms/plp'

import dynamic from 'next/dynamic'
import { useMemo, useRef } from 'react'
import COMPONENTS from 'src/components/cms/plp/Components'
import PageProvider, { PLPContext } from 'src/sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'

const ScrollToTopButton = dynamic(
  () =>
    import(
      /* webpackChunkName: "ScrollToTopButton" */
      'src/components/sections/ScrollToTopButton'
    )
)

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
  const shouldUpdatePages = useRef(true)
  const {
    state: { sort, term, selectedFacets, page },
  } = useSearch()
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  const { data: pageProductGalleryData, localizedVariablesKey } =
    useProductGalleryQuery({
      term,
      sort,
      selectedFacets,
      itemsPerPage,
    })

  const { pages, useGalleryPage, updatesPages } = useCreateUseGalleryPage()

  // Performance - updates page just in first fetch of gallery page
  let pagesFromFirstFetch: ClientManyProductsQueryQuery[] = []
  if (shouldUpdatePages.current && pageProductGalleryData) {
    pagesFromFirstFetch = updatesPages({
      page,
      data: pageProductGalleryData as ClientManyProductsQueryQuery,
      localizedVariablesKey,
    })

    if (pages.length === 0) {
      pages[page] = pagesFromFirstFetch[page]
    }
    shouldUpdatePages.current = false
  }

  const context = useMemo(
    () =>
      ({
        data: {
          ...deepmerge(
            { ...server },
            { ...pageProductGalleryData },
            { arrayMerge: overwriteMerge }
          ),
          pages,
        },
      } as PLPContext),
    [server, pageProductGalleryData, pages]
  )

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
          >
            <LazyLoadingSection name="ScrollToTopButton">
              <ScrollToTopButton />
            </LazyLoadingSection>
          </RenderSections>
        </UseGalleryPageContext.Provider>
      </PageProvider>
    </>
  )
}
