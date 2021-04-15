import { graphql } from 'gatsby'
import React, { lazy } from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'
import { SuspenseViewport } from '@vtex/store-ui'

import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import AboveTheFold from '../components/SearchPage/AboveTheFold'
import AboveTheFoldPreview from '../components/SearchPage/AboveTheFoldPreview'
import BelowTheFoldPreview from '../components/SearchPage/BelowTheFoldPreview'
import SEO from '../components/SearchPage/SEO'
import { useQuery } from '../sdk/graphql/useQuery'
import { usePixelSendEvent } from '../sdk/pixel/usePixelSendEvent'
import { SearchProvider } from '../sdk/search/Provider'
import { useSearchFiltersFromPageContext } from '../sdk/search/useSearchFiltersFromPageContext'
import { isServer } from '../utils/env'
import { SearchPageQuery } from './__generated__/SearchPageQuery.graphql'
import type {
  SearchPageQueryQuery,
  SearchPageQueryQueryVariables,
} from './__generated__/SearchPageQuery.graphql'
import { useRegion } from '../sdk/region/useRegion'


const belowTheFoldPreloader = () =>
  import('../components/SearchPage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)

export type SearchPageContext = SearchPageQueryQueryVariables

export type SearchPageProps = PageProps<
  SearchPageQueryQuery,
  SearchPageContext
> & {
  staticPath: boolean
}

const SearchPage: FC<SearchPageProps> = (props) => {
  const { pageContext, data: staticData } = props
  const filters = useSearchFiltersFromPageContext(pageContext)
  const { regionId } = useRegion()
  const staticPath =
    pageContext.staticPath &&
    pageContext.orderBy === filters.orderBy &&
    filters.priceRange === null

  const selectedFacets = ([] as typeof filters.selectedFacets)
    .concat(filters?.selectedFacets ?? [])
    .concat(
      regionId
        ? {
            key: 'region-id',
            value: regionId,
          }
        : []
    )

  const cleanFilters = {
    ...filters,
    query: undefined,
    map: undefined,
  }

  const { data } = useQuery<
    SearchPageQueryQuery,
    SearchPageQueryQueryVariables
  >({
    ...SearchPageQuery,
    variables: { ...cleanFilters, selectedFacets, staticPath: true },
    suspense: true,
    initialData: staticPath ? staticData : undefined,
  })

  usePixelSendEvent(
    () => {
      const pageType = filters.fullText ? 'fullText' : 'plp'

      return [
        {
          type: 'vtex:pageView',
          data: {
            pageUrl: window.location.href,
            pageTitle: document.title,
            referrer: document.referrer,
            accountName: process.env.GATSBY_STORE_ID!,
            pageType,
          },
        },
        {
          type: 'vtex:internalSiteSearchView',
          data: {
            accountName: process.env.GATSBY_STORE_ID!,
            pageUrl: window.location.href,
            pageTitle: document.title,
            referrer: document.referrer,
            // TODO: see if including query here is necessary
            // term: filters.fullText ?? filters.query ?? '',
            term: filters.fullText ?? '',
            results: data?.vtex.productSearch?.recordsFiltered ?? 0,
            pageType,
          },
        },
      ]
    },
    isServer ? '' : window.location.href
  )

  const pageProps = {
    ...props,
    staticPath,
    data: data!,
  }

  return (
    <SearchProvider filters={filters} data={data!}>
      <SEO {...pageProps} />
      <AboveTheFold {...pageProps} />
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
      >
        <BelowTheFold {...pageProps} />
      </SuspenseViewport>
    </SearchProvider>
  )
}

const Page: FC<SearchPageProps> = (props) => {
  const {
    pageContext: { staticPath },
  } = props

  return (
    <Layout>
      <HybridWrapper
        isPrerendered={staticPath}
        fallback={<AboveTheFoldPreview />}
      >
        <SearchPage {...props} />
      </HybridWrapper>
    </Layout>
  )
}

export const query = graphql`
  query SearchPageQuery(
    $from: Int = 0
    $to: Int = 11
    $query: String
    $map: String
    $fullText: String
    $staticPath: Boolean!
    $selectedFacets: [VTEX_SelectedFacetInput!]
    $orderBy: String = "OrderByScoreDESC"
  ) {
    vtex {
      productSearch(
        from: $from
        to: $to
        hideUnavailableItems: false
        simulationBehavior: skip
        orderBy: $orderBy
        query: $query
        map: $map
        fullText: $fullText
        selectedFacets: $selectedFacets
      ) @include(if: $staticPath) {
        products {
          id: productId
          productName
          linkText
          items {
            itemId
            images {
              imageUrl
              imageText
            }
          }
        }
        recordsFiltered
      }
      searchMetadata(
        query: $query
        map: $map
        fullText: $fullText
        selectedFacets: $selectedFacets
      ) @include(if: $staticPath) {
        title: titleTag
        description: metaTagDescription
      }
      facets(
        query: $query
        map: $map
        fullText: $fullText
        selectedFacets: $selectedFacets
        operator: or
        behavior: "Static"
        removeHiddenFacets: true
      ) @include(if: $staticPath) {
        breadcrumb {
          href
          name
        }
        facets {
          name
          type
          values {
            key
            name
            value
            selected
            quantity
            range {
              from
              to
            }
            values: children {
              key
              name
              value
              selected
              quantity
              range {
                from
                to
              }
              values: children {
                key
                name
                value
                selected
                quantity
                range {
                  from
                  to
                }
              }
            }
          }
        }
      }
    }
  }
`

export default Page
