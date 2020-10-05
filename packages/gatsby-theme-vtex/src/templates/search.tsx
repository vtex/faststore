/* eslint-disable no-shadow */
import { graphql, PageProps } from 'gatsby'
import React, { FC, lazy } from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import AboveTheFold from '../components/SearchPage/AboveTheFold'
import AboveTheFoldPreview from '../components/SearchPage/AboveTheFoldPreview'
import BelowTheFoldPreview from '../components/SearchPage/BelowTheFoldPreview'
import SuspenseSSR from '../components/Suspense/SSR'
import SuspenseViewport from '../components/Suspense/Viewport'
import { useQuery } from '../sdk/graphql/useQuery'
import { SearchProvider } from '../sdk/search/Provider'
import { useSearchFiltersFromPageContext } from '../sdk/search/useSearchFiltersFromPageContext'
import {
  SearchPageQuery,
  SearchPageQueryQuery,
  SearchPageQueryQueryVariables,
} from './__generated__/SearchPageQuery.graphql'

const belowTheFoldPreloader = () =>
  import('../components/SearchPage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)
const SEO = lazy(() => import('../components/SearchPage/SEO'))

export type SearchPageProps = PageProps<
  SearchPageQueryQuery,
  SearchPageQueryQueryVariables
>

const SearchPage: FC<SearchPageProps> = (props) => {
  const { pageContext, data: staticData } = props
  const { staticPath } = pageContext
  const filters = useSearchFiltersFromPageContext(pageContext)
  const { data } = useQuery<
    SearchPageQueryQuery,
    SearchPageQueryQueryVariables
  >({
    ...SearchPageQuery,
    variables: { ...filters, staticPath: true },
    suspense: true,
    initialData: staticPath ? staticData : undefined,
  })

  if (!data) {
    return <div>Not Found</div>
  }

  return (
    <SearchProvider filters={filters as any} data={data}>
      <AboveTheFold {...props} data={data} />
      <SuspenseSSR fallback={null}>
        <SEO {...props} data={data} />
      </SuspenseSSR>
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
      >
        <BelowTheFold />
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
        <ErrorBoundary fallback={<div>Error !!</div>}>
          <SearchPage {...props} />
        </ErrorBoundary>
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
        to: 9
        hideUnavailableItems: true
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
