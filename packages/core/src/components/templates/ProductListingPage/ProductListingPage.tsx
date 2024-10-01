import type { SearchState } from '@faststore/sdk'
import {
  formatSearchState,
  parseSearchState,
  SearchProvider,
} from '@faststore/sdk'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import type { ServerCollectionPageQueryQuery } from '@generated/graphql'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'

import { PLPContentType } from 'src/server/cms/plp'

import storeConfig from '../../../../faststore.config'
import ProductListing from './ProductListing'
import { usePageViewEvent } from 'src/sdk/analytics/hooks/usePageViewEvent'

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery
  page: PLPContentType
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

export default function ProductListingPage({
  page: plpContentType,
  data: server,
}: ProductListingPageProps) {
  const { settings } = plpContentType
  const collection = server.collection
  const router = useRouter()
  const applySearchState = useApplySearchState()
  const searchParams = useSearchParams({
    collection,
    sort: settings?.productGallery?.sortBySelection as SearchState['sort'],
  })

  const title = collection?.seo.title ?? storeConfig.seo.title
  const description = collection?.seo.description ?? storeConfig.seo.title
  const [pathname] = router.asPath.split('?')
  const canonical = `${storeConfig.storeUrl}${pathname}`
  const itemsPerPage = settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE

  usePageViewEvent({ pageTitle: title })

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

      <ProductListing page={plpContentType} data={server} />
    </SearchProvider>
  )
}
