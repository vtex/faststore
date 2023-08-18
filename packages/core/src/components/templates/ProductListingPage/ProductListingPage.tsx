import type { SearchState } from '@faststore/sdk'
import {
  formatSearchState,
  parseSearchState,
  SearchProvider,
} from '@faststore/sdk'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMemo, useRef } from 'react'

import type {
  ClientProductGalleryQueryQuery,
  ServerCollectionPageQueryQuery,
} from '@generated/graphql'
import Breadcrumb from 'src/components/sections/Breadcrumb'
import Hero from 'src/components/sections/Hero'
import ProductGallery from 'src/components/sections/ProductGallery'
import ProductShelf from 'src/components/sections/ProductShelf'
import ScrollToTopButton from 'src/components/sections/ScrollToTopButton'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'

import type { ComponentType } from 'react'
import RenderSections from 'src/components/cms/RenderSections'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import { PLPContentType } from 'src/server/cms'

import storeConfig from '../../../../faststore.config'
import {
  ProductsPerPage,
  usePageProductsQuery,
} from 'src/sdk/product/usePageProductsQuery'
import { useProductGalleryQuery } from 'src/sdk/product/useProductGalleryQuery'
import PageProvider from 'src/sdk/overrides/PageProvider'
import deepmerge from 'deepmerge'

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery
  page: PLPContentType
}

export interface ProductListingPageContext {
  data?: ServerCollectionPageQueryQuery &
    ClientProductGalleryQueryQuery & { productsPerPage: ProductsPerPage[] }
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

type UseSearchParams = {
  collection: ServerCollectionPageQueryQuery['collection']
  sort: SearchState['sort']
}
const useSearchParams = ({
  collection,
  sort,
}: UseSearchParams): SearchState => {
  const selectedFacets = collection?.meta.selectedFacets
  const { asPath } = useRouter()

  const hrefState = useMemo(() => {
    const url = new URL(asPath, 'http://localhost')

    const shouldUpdateDefaultSort = sort && !url.searchParams.has('sort')
    if (shouldUpdateDefaultSort) {
      url.searchParams.set('sort', sort)
    }

    const newState = parseSearchState(url)
    // In case we are in an incomplete url
    if (newState.selectedFacets.length === 0) {
      newState.selectedFacets = selectedFacets
    }

    return formatSearchState(newState).href
  }, [asPath, selectedFacets, sort])

  return useMemo(() => parseSearchState(new URL(hrefState)), [hrefState])
}

const overwriteMerge = (_, sourceArray, __) => sourceArray

export default function ProductListingPage({
  page: { sections, settings },
  data: server,
}: ProductListingPageProps) {
  const collection = server.collection
  const router = useRouter()
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    collection,
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })

  const { page, sort, term, selectedFacets } = searchParams
  const title = collection?.seo.title ?? storeConfig.seo.title
  const description = collection?.seo.description ?? storeConfig.seo.title
  const pageQuery = page !== 0 ? `?page=${page}` : ''
  const separator = pageQuery !== '' ? '&' : '?'
  const sortQuery = !!sort ? `${separator}sort=${sort}` : ''
  const [pathname] = router.asPath.split('?')
  const canonical = `${storeConfig.storeUrl}${pathname}${pageQuery}${sortQuery}`
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE
  const initialPage = useRef(page)

  const { data: pageProductGalleryData } = useProductGalleryQuery({
    term,
    sort,
    selectedFacets,
    itemsPerPage,
  })

  const { productsPerPage } = usePageProductsQuery({
    page: initialPage.current,
    term,
    sort,
    selectedFacets,
    itemsPerPage,
  })

  const context = {
    data: {
      ...deepmerge(
        { ...server },
        { ...pageProductGalleryData },
        { arrayMerge: overwriteMerge }
      ),
      productsPerPage,
    },
  } as ProductListingPageContext

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={itemsPerPage}
      {...searchParams}
    >
      {/* SEO */}
      <NextSeo
        title={title}
        description={description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={canonical}
        openGraph={{
          type: 'website',
          title,
          description,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={collection?.breadcrumbList.itemListElement ?? []}
      />

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
        <RenderSections sections={sections} components={COMPONENTS} />
      </PageProvider>

      <ScrollToTopButton />
    </SearchProvider>
  )
}
