import { useSearch } from '@faststore/sdk'
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

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import PageProvider, { type PLPContext } from 'src/sdk/overrides/PageProvider'
import {
  useCreateUseGalleryPage,
  UseGalleryPageContext,
} from 'src/sdk/product/usePageProductsQuery'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import { useApplySearchState } from 'src/sdk/search/state'
import { isContentPlatformSource } from 'src/server/content/utils'

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

  const initialPages = { search: { ...server?.search, searchId: '' } }
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

  // ProductGallery is the primary above-fold content on the PLP. By default,
  // RenderSections wraps every section in a ViewportObserver (LazyLoadingSection),
  // which initialises as `isVisible=false` on the server and only reveals its
  // children after the IntersectionObserver fires client-side (~hydration time).
  // For ProductGallery this means zero <img> tags appear in the SSR HTML, leaving
  // the browser with nothing to fetch until React hydrates — the direct cause of
  // the ~2 s resource-load-delay on the LCP metric. Setting skipLazyLoadingSection
  // bypasses the ViewportObserver so Next.js SSG/ISR embeds the product <img>
  // elements in the initial HTML and the browser can start fetching them at parse time.
  const sectionsEager =
    sections?.map((section) =>
      section.name === 'ProductGallery'
        ? {
            ...section,
            data: { ...section.data, skipLazyLoadingSection: true },
          }
        : section
    ) ?? sections

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
            sections={sectionsEager}
            globalSections={globalSections}
            components={COMPONENTS}
          />
        </UseGalleryPageContext.Provider>
      </PageProvider>
    </>
  )
}
