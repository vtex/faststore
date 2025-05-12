import { formatSearchState, useSearch } from '@faststore/sdk'
import type {
  ServerCollectionPageQueryQuery,
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '@generated/graphql'
import deepmerge from 'deepmerge'
import { ITEMS_PER_PAGE } from 'src/constants'

import dynamic from 'next/dynamic'
import COMPONENTS from 'src/components/cms/plp/Components'

import RenderSections, {
  LazyLoadingSection,
} from 'src/components/cms/RenderSections'
import type { PLPContentType } from 'src/server/cms/plp'

import { useEffect } from 'react'
import PageProvider, { type PLPContext } from 'src/sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import { useApplySearchState } from 'src/sdk/search/state'
import { useRouter } from 'next/router'
import { isContentPlatformSource } from 'src/server/content/utils'

const ScrollToTopButton = dynamic(
  () =>
    import(
      /* webpackChunkName: "ScrollToTopButton" */
      'src/components/sections/ScrollToTopButton'
    )
)

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
  serverManyProductsVariables: ServerManyProductsQueryQueryVariables
  page: PLPContentType
  globalSections?: Array<{ name: string; data: any }>
}

// Array merging strategy from deepmerge that makes client arrays overwrite server array
// https://www.npmjs.com/package/deepmerge
const overwriteMerge = (_: any[], sourceArray: any[]) => sourceArray

export default function ProductListing({
  page: { sections, settings },
  data: server,
  serverManyProductsVariables,
  globalSections,
}: ProductListingPageProps) {
  const router = useRouter()
  const { state } = useSearch()
  const { sort, term, selectedFacets } = state

  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  const applySearchState = useApplySearchState()
  useEffect(() => {
    if (!isContentPlatformSource() || !router.isPreview) {
      applySearchState(formatSearchState(state))
    }
  }, [])

  const { data: pageProductGalleryData } = useProductGalleryQuery({
    term,
    sort,
    selectedFacets,
    itemsPerPage,
  })

  const initialPages = { search: server?.search }
  const { pages, useGalleryPage } = useCreateUseGalleryPage({
    initialPages,
    serverManyProductsVariables,
  })

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
          >
            <LazyLoadingSection sectionName="ScrollToTopButton">
              <ScrollToTopButton />
            </LazyLoadingSection>
          </RenderSections>
        </UseGalleryPageContext.Provider>
      </PageProvider>
    </>
  )
}
