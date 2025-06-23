import type { GlobalSearchState as SearchState } from '@faststore/sdk'
import { useGlobalSearchState as useSearch } from '@faststore/sdk'
import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import type {
  ServerCollectionPageQueryQuery,
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '@generated/graphql'
import { ITEMS_PER_PAGE } from 'src/constants'
import { useApplySearchState } from 'src/sdk/search/state'

import type { PLPContentType } from 'src/server/cms/plp'

import storeConfig from '../../../../discovery.config'
import ProductListing from './ProductListing'

export type ProductListingPageProps = {
  data: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
  serverManyProductsVariables: ServerManyProductsQueryQueryVariables
  page: PLPContentType
  globalSections?: Array<{ name: string; data: any }>
  globalSectionsSettings?: Record<string, any>
}

type UseSearchParams = {
  collection: ServerCollectionPageQueryQuery['collection']
  sort: SearchState['sort']
  serverData?: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
}
export default function ProductListingPage({
  page: plpContentType,
  data: server,
  serverManyProductsVariables,
  globalSections,
  globalSectionsSettings,
}: ProductListingPageProps) {
  const { settings } = plpContentType
  const collection = server.collection
  const router = useRouter()
  const { state } = useSearch()
  useApplySearchState()

  useEffect(() => {
    if (state.selectedFacets.length === 0) {
      state.setSelectedFacets([
        ...server.collection?.meta.selectedFacets,
        {
          key: 'fuzzy',
          value: server?.search?.metadata?.fuzzy ?? 'auto',
        },
        {
          key: 'operator',
          value: server?.search?.metadata?.logicalOperator ?? 'and',
        },
      ])
    }
    const sort = plpContentType.settings?.productGallery
      ?.sortBySelection as SearchState['sort']
    if (sort && !state.sort) {
      state.setSort(sort)
    }
  }, [state.selectedFacets, state.sort, server, plpContentType])

  const {
    seo: { plp: plpSeo, ...storeSeo },
  } = storeConfig
  const title = collection?.seo.title ?? storeSeo.title
  const titleTemplate = plpSeo?.titleTemplate ?? storeSeo.titleTemplate
  const description =
    collection?.seo.description || // Use description that comes from the Checkout API
    plpSeo?.descriptionTemplate?.replace(/%s/g, () => title) || // Use description template from the SEO config for PLP
    storeSeo.description // Use default description from the store SEO config

  const [pathname] = router.asPath.split('?')
  const canonical = `${storeConfig.storeUrl}${pathname}`
  state.setItemsPerPage(
    settings?.productGallery?.itemsPerPage ?? ITEMS_PER_PAGE
  )

  let itemListElements = collection?.breadcrumbList.itemListElement ?? []
  if (itemListElements.length !== 0) {
    itemListElements = itemListElements.map(
      ({ item: pathname, name, position }) => {
        const pageUrl = storeConfig.storeUrl + pathname

        return { name, position, item: pageUrl }
      }
    )
  }

  return (
    <>
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
        globalSectionsSettings={globalSectionsSettings}
        page={plpContentType}
        data={server}
        serverManyProductsVariables={serverManyProductsVariables}
      />
    </>
  )
}
