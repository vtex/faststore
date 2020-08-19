/* eslint-disable no-shadow */
import { graphql, PageProps } from 'gatsby'
import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
// import { t } from 'frenchkiss'

import ErrorBoundary from '../components/ErrorBoundary'
import HybridWrapper from '../components/HybridWrapper'
import Layout from '../components/Layout'
import SearchTemplate from '../components/Search'
import { useQuery } from '../sdk/graphql/useQuery'
import { useSearchFilters } from '../sdk/search/useSearchFilters'
import { SearchFiltersProvider } from '../sdk/search/FiltersProvider'
import {
  SearchPageQuery,
  SearchPageQueryQuery,
  SearchPageQueryQueryVariables,
} from './__generated__/SearchPageQuery.graphql'

type Props = PageProps<SearchPageQueryQuery, SearchPageQueryQueryVariables>

const SearchPage: FC<Props> = ({
  data: initialData,
  pageContext: { staticPath },
}) => {
  const filters = useSearchFilters()
  const { data } = useQuery<
    SearchPageQueryQuery,
    SearchPageQueryQueryVariables
  >({
    ...SearchPageQuery,
    variables: { ...filters, staticPath: true },
    suspense: true,
    initialData: staticPath ? initialData : undefined,
  })

  if (!data) {
    return <div>Not Found</div>
  }

  return <SearchTemplate data={data} />
}

const SearchPageContainer: FC<Props> = (props) => {
  const {
    pageContext: { query, map, orderBy, staticPath },
  } = props

  return (
    <Layout>
      <SearchFiltersProvider filters={{ query, map, orderBy }}>
        <HybridWrapper
          isPrerendered={staticPath}
          // fallback={<div>{t('loading')}</div>}
          fallback={<FormattedMessage id="loading" />}
        >
          {/* <ErrorBoundary fallback={<div>{t('loading')}</div>}> */}
          <ErrorBoundary fallback={<FormattedMessage id="loading" />}>
            <SearchPage {...props} />
          </ErrorBoundary>
        </HybridWrapper>
      </SearchFiltersProvider>
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
      facets(query: $query, map: $map, operator: or, behavior: "Dynamic")
        @include(if: $staticPath) {
        specificationFilters {
          name
          values: facets {
            to: linkEncoded
            name
            selected
            quantity
          }
        }
        brands {
          to: linkEncoded
          name
          selected
          quantity
        }
        categoriesTrees {
          name
          quantity
          selected
          to: linkEncoded
          values: children {
            name
            quantity
            selected
            to: linkEncoded
          }
        }
      }
    }
  }
`

export default SearchPageContainer
