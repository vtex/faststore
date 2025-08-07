import { formatSearchState, useSearch } from '@faststore/sdk'
import type {
  ServerCollectionPageQueryQuery,
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '../../../../@generated/graphql'
import deepmerge from 'deepmerge'
import { ITEMS_PER_PAGE } from '../../../constants'

import dynamic from 'next/dynamic'
import COMPONENTS from '../../cms/plp/Components'

import RenderSections, { LazyLoadingSection } from '../../cms/RenderSections'
import type { PLPContentType } from '../../../server/cms/plp'

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import PageProvider, {
  type PLPContext,
} from '../../../sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from '../../../sdk/product/usePageProductsQuery'
import { useProductGalleryQuery } from '../../../sdk/product/useProductGalleryQuery'
import { useApplySearchState } from '../../../sdk/search/state'
import { isContentPlatformSource } from '../../../server/content/utils'

const ScrollToTopButton = dynamic(
  () =>
    import(
      /* webpackChunkName: "ScrollToTopButton" */
      '../../sections/ScrollToTopButton'
    )
)

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
  serverManyProductsVariables: ServerManyProductsQueryQueryVariables
  page: PLPContentType
  globalSections?: Array<{ name: string; data: any }>
  globalSettings?: Record<string, unknown>
}

// Array merging strategy from deepmerge that makes client arrays overwrite server array
// https://www.npmjs.com/package/deepmerge
const overwriteMerge = (_: any[], sourceArray: any[]) => sourceArray

export default function ProductListing({
  page: { sections, settings },
  data: server,
  serverManyProductsVariables,
  globalSections,
  globalSettings,
}: ProductListingPageProps) {
  const router = useRouter()
  const { state, serializedState } = useSearch()
  const { sort, term, selectedFacets } = state

  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  const applySearchState = useApplySearchState()
  useEffect(() => {
    if (!isContentPlatformSource() || !router.isPreview) {
      applySearchState(serializedState())
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
    globalSettings,
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
