/* eslint-disable no-shadow */
import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'

import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import SearchTemplate from '../components/Search'
import { useQuery } from '../sdk/graphql/useQuery'
import { useSearchFiltersFromPageContext } from '../sdk/search/useSearchFiltersFromPageContext'
import { SearchProvider as SearchProvider } from '../sdk/search/Provider'
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
    <SearchProvider filters={filters} data={data}>
      <SearchTemplate data={data} />
    </SearchProvider>
  )
}

const SearchPageContainer: FC<Props> = (props) => {
  const { pageContext: { staticPath } } = props

  return (
    <Layout>
      <HybridWrapper
        isPrerendered={staticPath}
        fallback={<div>loading...</div>}
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
    $staticPath: Boolean!
    $orderBy: String = "OrderByScoreDESC"
  ) {
    vtex {
      productSearch(
        orderBy: $orderBy
        query: $query
        map: $map
        from: 0
        to: 9
      ) @include(if: $staticPath) {
        products {
          ...ProductSummary_syncProduct
        }
        breadcrumb {
          href
          name
        }
        titleTag
        recordsFiltered
      }
      facets(query: $query, map: $map, operator: or, behavior: "Static")
        @include(if: $staticPath) {
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
