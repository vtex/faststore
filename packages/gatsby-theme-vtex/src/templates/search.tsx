/* eslint-disable no-shadow */
import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import SearchTemplate from '../components/SearchPage'
import Preview from '../components/SearchPage/Preview'
import { useQuery } from '../sdk/graphql/useQuery'
import { SearchProvider } from '../sdk/search/Provider'
import { useSearchFiltersFromPageContext } from '../sdk/search/useSearchFiltersFromPageContext'
import {
  SearchPageQuery,
  SearchPageQueryQuery,
  SearchPageQueryQueryVariables,
} from './__generated__/SearchPageQuery.graphql'

type Props = PageProps<SearchPageQueryQuery, SearchPageQueryQueryVariables>

const SearchPage: FC<Props> = ({ pageContext, data: staticData }) => {
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
      <SearchTemplate data={data} />
    </SearchProvider>
  )
}

const SearchPageContainer: FC<Props> = (props) => {
  const {
    pageContext: { staticPath },
  } = props

  return (
    <Layout>
      <HybridWrapper isPrerendered={staticPath} fallback={<Preview />}>
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
        orderBy: $orderBy
        query: $query
        map: $map
        fullText: $fullText
        selectedFacets: $selectedFacets
        hideUnavailableItems: true
        simulationBehavior: skip
        from: 0
        to: 9
      ) @include(if: $staticPath) {
        products {
          ...ProductSummary_syncProduct
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

export default SearchPageContainer
