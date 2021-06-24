/* eslint-disable react-hooks/rules-of-hooks */
import { gql } from '@vtex/gatsby-plugin-graphql'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Grid, UIButton } from '@vtex/store-ui'
import type { FC } from 'react'
import React, { Fragment } from 'react'

import { useSearchInfinite } from '../../../sdk/search/useSearchInfinite'
import OverlaySpinner from './OverlaySpinner'
import Page from './Page'
import type { SearchQueryQuery } from './__generated__/SearchQuery.graphql'
import { SearchQuery } from './__generated__/SearchQuery.graphql'

interface Props {
  initialData: SearchQueryQuery | undefined
  columns: number[]
  pageSize?: number
}

const List: FC<Props> = ({ initialData, columns, pageSize }) => {
  const { formatMessage } = useIntl()
  const { data, fetchMore, isLoadingMore, isReachingEnd } = useSearchInfinite({
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
      <UIButton
        variant="loadMore"
        onClick={(e: any) => {
          e.target.blur?.()
          fetchMore()
        }}
        aria-label={loadMoreLabel}
        disabled={isReachingEnd || isLoadingMore}
      >
        {isReachingEnd ? '' : isLoadingMore ? loadingLabel : loadMoreLabel}
      </UIButton>
    </Fragment>
  )
}

export const query = gql`
  query SearchQuery(
    $query: String
    $map: String
    $fullText: String
    $selectedFacets: [StoreSelectedFacetInput!]
    $from: Int
    $to: Int
    $orderBy: String
    $hideUnavailableItems: Boolean = false
  ) {
    vtex {
      productSearch(
        hideUnavailableItems: $hideUnavailableItems
        selectedFacets: $selectedFacets
        fullText: $fullText
        query: $query
        map: $map
        from: $from
        to: $to
        orderBy: $orderBy
      ) {
        products {
          ...ProductSummaryFragment_product
        }
      }
    }
  }
`

export default List
