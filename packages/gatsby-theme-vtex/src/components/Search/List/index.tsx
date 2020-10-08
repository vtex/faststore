/* eslint-disable react-hooks/rules-of-hooks */
import { gql } from '@vtex/gatsby-plugin-graphql'
import { Button, Grid } from '@vtex/store-ui'
import React, { FC, Fragment } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import {
  SearchQuery,
  SearchQueryQuery,
} from './__generated__/SearchQuery.graphql'
import OverlaySpinner from './OverlaySpinner'
import Page from './Page'
import { useSearch } from '../../../sdk/search/useSearch'

interface Props {
  initialData: SearchQueryQuery | undefined
  columns: number[]
  pageSize?: number
}

const List: FC<Props> = ({ initialData, columns, pageSize }) => {
  const { formatMessage } = useIntl()
  const { data, fetchMore, isLoadingMore, isReachingEnd } = useSearch({
    query: SearchQuery,
    initialData,
    pageSize,
  })

  const loadMoreLabel = formatMessage({ id: 'search.page-list.more' })
  const loadingLabel = formatMessage({ id: 'search.page-list.more.loading' })

  if (!data) {
    return <OverlaySpinner />
  }

  return (
    <Fragment>
      <Grid variant="search" columns={columns}>
        {data.map((searchQuery, index) => (
          <Page
            key={`summary-page-${index}`}
            products={searchQuery!.vtex.productSearch!.products!}
          />
        ))}
      </Grid>
      <Button
        variant="loadMore"
        onClick={(e) => {
          ;(e.target as any).blur?.()
          fetchMore()
        }}
        aria-label={loadMoreLabel}
        disabled={isReachingEnd || isLoadingMore}
      >
        {isReachingEnd ? '' : isLoadingMore ? loadingLabel : loadMoreLabel}
      </Button>
    </Fragment>
  )
}

export const query = gql`
  query SearchQuery(
    $query: String
    $map: String
    $fullText: String
    $selectedFacets: [VTEX_SelectedFacetInput!]
    $from: Int
    $to: Int
    $orderBy: String
  ) {
    vtex {
      productSearch(
        productOriginVtex: true
        hideUnavailableItems: true
        selectedFacets: $selectedFacets
        fullText: $fullText
        query: $query
        map: $map
        from: $from
        to: $to
        orderBy: $orderBy
      ) {
        products {
          ...ProductSummary_product
        }
      }
    }
  }
`

export default List
