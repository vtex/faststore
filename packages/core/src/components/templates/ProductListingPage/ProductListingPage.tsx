import type { SearchState } from '@faststore/sdk'
import {
  formatSearchState,
  parseSearchState,
  SearchProvider,
} from '@faststore/sdk'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import type {
  ServerCollectionPageQueryQuery,
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '@generated/graphql'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'

import type { PLPContentType } from 'src/server/cms/plp'

import storeConfig from '../../../../discovery.config'
import { faststoreLoader } from 'src/components/ui/Image/loader'
import ProductListing from './ProductListing'
import { getStoreURL } from 'src/sdk/localization/useLocalizationConfig'

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
  serverManyProductsVariables: ServerManyProductsQueryQueryVariables
  page: PLPContentType
  globalSections?: Array<{ name: string; data: any }>
  globalSettings?: Record<string, unknown>
}

type UseSearchParams = {
  collection: ServerCollectionPageQueryQuery['collection']
  sort: SearchState['sort']
  serverData?: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
}
const useSearchParams = ({
  collection,
  sort,
  serverData,
}: UseSearchParams): SearchState => {
  const selectedFacets = [
    ...collection?.meta.selectedFacets,
    {
      key: 'fuzzy',
      value: serverData?.search?.metadata?.fuzzy ?? 'auto',
    },
    {
      key: 'operator',
      value: serverData?.search?.metadata?.logicalOperator ?? 'and',
    },
  ]
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

export default function ProductListingPage({
  page: plpContentType,
  data: server,
  serverManyProductsVariables,
  globalSections,
  globalSettings,
}: ProductListingPageProps) {
  const { settings } = plpContentType
  const collection = server.collection
  const router = useRouter()
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    collection,
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
    serverData: server,
  })

  const {
    seo: { plp: plpSeo, ...storeSeo },
  } = storeConfig
  const title = collection?.seo.title ?? storeSeo.title
  const titleTemplate =
    settings?.seo?.titleTemplate ??
    plpSeo?.titleTemplate ??
    storeSeo.titleTemplate
  const description =
    collection?.seo.description || // Use description that comes from the Checkout API
    plpSeo?.descriptionTemplate?.replace(/%s/g, () => title) || // Use description template from the SEO config for PLP
    storeSeo.description // Use default description from the store SEO config
  const storeURL = getStoreURL()

  const [pathname] = router.asPath.split('?')
  const canonical = `${storeURL}${pathname}`
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  let itemListElements = collection?.breadcrumbList.itemListElement ?? []
  if (itemListElements.length !== 0) {
    itemListElements = itemListElements.map(
      ({ item: pathname, name, position }) => {
        const pageUrl = storeURL + pathname

        return { name, position, item: pageUrl }
      }
    )
  }

  // Preload the above-fold LCP image at parse time so the browser doesn't
  // wait for JS hydration to discover and fetch it.
  //
  // The hero section (if present) is always the first large above-fold image
  // and is the true LCP candidate on PLPs that include one. Its URL lives in
  // plpContentType.sections[].data.image.src.
  //
  // Fallback: if no hero section exists, preload the first product image.
  // In both cases we pass the raw CDN URL through faststoreLoader so the
  // preload href exactly matches the optimized URL the Image component renders.
  const heroSection = plpContentType.sections.find(
    (s: { name: string; data: any }) => s.name === 'Hero'
  )
  const rawLcpImageUrl: string | undefined =
    heroSection?.data?.image?.src ??
    server?.search?.products?.edges?.[0]?.node?.image?.[0]?.url
  // Hero images use the full viewport width on mobile (≈ 390px); 640 covers
  // 2× DPR. Product images use sizes="30vw" so 256 is the right step.
  const lcpImageWidth = heroSection ? 640 : 256
  const lcpImageUrl = rawLcpImageUrl
    ? faststoreLoader({
        src: rawLcpImageUrl,
        width: lcpImageWidth,
        quality: 75,
      })
    : undefined

  return (
    <SearchProvider
      onChange={applySearchState}
      itemsPerPage={itemsPerPage}
      shouldResetInfiniteScroll={!storeConfig.experimental?.scrollRestoration}
      {...searchParams}
    >
      {lcpImageUrl && (
        <Head>
          <link
            rel="preload"
            as="image"
            href={lcpImageUrl}
            fetchPriority="high"
          />
        </Head>
      )}
      {/* SEO */}
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleTemplate}
        canonical={canonical}
        openGraph={{
          type: 'website',
          title,
          description,
        }}
      />
      <BreadcrumbJsonLd itemListElements={itemListElements} />

      <ProductListing
        globalSections={globalSections}
        globalSettings={globalSettings}
        page={plpContentType}
        data={server}
        serverManyProductsVariables={serverManyProductsVariables}
      />
    </SearchProvider>
  )
}
