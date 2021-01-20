import { graphql } from 'gatsby'
import React, { lazy } from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import AboveTheFold from '../components/SearchPage/AboveTheFold'
import AboveTheFoldPreview from '../components/SearchPage/AboveTheFoldPreview'
import BelowTheFoldPreview from '../components/SearchPage/BelowTheFoldPreview'
import SEO from '../components/SearchPage/SEO'
import SuspenseViewport from '../components/Suspense/Viewport'
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

const belowTheFoldPreloader = () =>
  import('../components/SearchPage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)

export type SearchPageProps = PageProps<
  SearchPageQueryQuery,
  SearchPageQueryQueryVariables
> & { staticPath: boolean }

const SearchPage: FC<SearchPageProps> = (props) => {
  const { pageContext, data: staticData } = props
  const filters = useSearchFiltersFromPageContext(pageContext)
  const staticPath =
    pageContext.staticPath && pageContext.orderBy === filters.orderBy

  const { data } = useQuery<
    SearchPageQueryQuery,
    SearchPageQueryQueryVariables
  >({
    ...SearchPageQuery,
    variables: { ...filters, staticPath: true },
    suspense: true,
    initialData: staticPath ? staticData : undefined,
  })

  usePixelSendEvent(
    () => [
      {
        type: 'vtex:pageView',
        data: {
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          accountName: process.env.GATSBY_STORE_ID!,
        },
      },
      {
        type: 'vtex:internalSiteSearchView',
        data: {
          accountName: process.env.GATSBY_STORE_ID!,
          pageUrl: window.location.href,
          pageTitle: document.title,
          referrer: document.referrer,
          term: filters.fullText ?? '',
          results: data?.vtex.productSearch?.recordsFiltered ?? 0,
        },
      },
    ],
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
    $query: String
    $map: String
    $fullText: String
    $staticPath: Boolean!
    $selectedFacets: [VTEX_SelectedFacetInput!]
    $orderBy: String = "OrderByScoreDESC"
  ) {
    vtex {
      productSearch(
        from: 0
        to: 11
        hideUnavailableItems: false
        productOriginVtex: true
        simulationBehavior: skip
        orderBy: $orderBy
        query: $query
        map: $map
        fullText: $fullText
        selectedFacets: $selectedFacets
      ) @include(if: $staticPath) {
        products {
          productId
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
        titleTag
        recordsFiltered
      }
      facets(
        query: $query
        map: $map
        fullText: $fullText
        selectedFacets: $selectedFacets
        operator: or
        behavior: "Static"
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
            values: children {
              key
              name
              value
              selected
              quantity
              values: children {
                key
                name
                value
                selected
                quantity
              }
            }
          }
        }
      }
    }
  }
`

export default Page
