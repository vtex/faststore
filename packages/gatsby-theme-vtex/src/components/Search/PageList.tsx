/* eslint-disable react-hooks/rules-of-hooks */
import { Product } from '@vtex/gatsby-source-vtex'
import { gql, request } from 'babel-gql'
import { graphql } from 'gatsby'
import React, { FC, Fragment, useCallback } from 'react'
import { useSWRInfinite } from 'swr'
import { Button, Grid } from 'theme-ui'

import { useSearchFilters } from '../../providers/Search'
import OverlaySpinner from './OverlaySpinner'
import Page from './Page'

const PAGE_SIZE = 10

export const fragment = graphql`
  fragment PageList_product on VTEX_Product {
    productId
    productName
    description
    linkText
    items {
      itemId
      images {
        imageUrl
        imageText
      }
      sellers {
        sellerId
        commertialOffer {
          AvailableQuantity
          Price
          ListPrice
        }
      }
    }
  }
`

const query = gql`
  query ClientOnlySearch($query: String, $map: String, $from: Int, $to: Int) {
    productSearch(query: $query, map: $map, from: $from, to: $to) {
      products {
        productId
        productName
        description
        linkText
        items {
          itemId
          images {
            imageUrl
            imageText
          }
          sellers {
            sellerId
            commertialOffer {
              AvailableQuantity
              Price
              ListPrice
            }
          }
        }
      }
    }
  }
`

const List: FC = () => {
  const { filters, initialData } = useSearchFilters()
  const { data, error, size, setSize } = useSWRInfinite<Product[]>(
    (page, previousPageData) => {
      if (page !== 0 && previousPageData?.length === 0) {
        return null
      }

      const from = page * PAGE_SIZE
      const to = (page + 1) * PAGE_SIZE - 1

      return JSON.stringify({
        ...filters,
        from,
        to,
      })
    },
    (varStr: string) =>
      request('/graphql/', {
        query,
        variables: JSON.parse(varStr),
        fetchOptions: {
          headers: {
            'x-vtex-graphql-referer': window.location.host,
          },
        },
      }).then((res) => res.data.productSearch.products),
    {
      revalidateOnMount: true,
      initialData: initialData && [initialData],
      initialSize: 2, // 2 will always prefetch the next page
    }
  )

  const fetchMore = useCallback(() => setSize!((s) => s + 1), [setSize])

  // Since we prefetch the next page, we always render one page less from
  // what we have in memory
  const viewSize = Math.max(1, size! - 1)

  // The code below was copied from SWR's own repo example
  // https://codesandbox.io/s/swr-infinite-z6r0r?file=/src/App.js
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    !!(data && typeof data[viewSize - 1] === 'undefined')

  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || !!(data && data[viewSize - 1]?.length < PAGE_SIZE)

  if (!data) {
    return <OverlaySpinner />
  }

  return (
    <Fragment>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {data.slice(0, viewSize).map((ps, index) => (
          <Page key={`summary-page-${index}`} products={ps} />
        ))}
      </Grid>
      {isReachingEnd ? null : (
        <Button
          variant="loadMore"
          onClick={fetchMore}
          disabled={isReachingEnd || isLoadingMore}
        >
          {isLoadingMore ? 'Loading...' : 'More'}
        </Button>
      )}
    </Fragment>
  )
}

export default List
