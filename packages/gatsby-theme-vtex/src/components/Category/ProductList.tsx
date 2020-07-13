/* eslint-disable react-hooks/rules-of-hooks */
import { Category } from '@vtex/gatsby-source-vtex'
import React, { FC, lazy, useEffect } from 'react'
import { responseInterface, useSWRPages } from 'swr'
import { Button, Grid } from 'theme-ui'

import { FetchedList } from '../../utils/fetcher'
import { ProductSummary } from '../ProductSummary'
import { SuspenseSSR } from '../SuspenseSSR'

const Page = lazy(() => import('./lazy'))

export const PAGE_SIZE = 10

interface Props {
  category: Category
}

const nextPage = ({ data }: responseInterface<FetchedList, unknown>) => {
  // no data was fetched, maybe it's finished
  if (!data) {
    return null
  }

  const {
    total,
    range: { to },
  } = data

  // No more pages to fetch
  if (to >= total) {
    return null
  }
  const next = (to + 1) / PAGE_SIZE + 1
  return next
}

const ProductList: FC<Props> = ({ category }) => {
  const { products, categoryId, name } = category
  const {
    pages,
    pageCount,
    isLoadingMore,
    loadMore,
    isReachingEnd,
  } = useSWRPages<number | null, FetchedList, unknown>(
    name,
    ({ offset, withSWR }) => (
      <SuspenseSSR
        fallback={
          <>
            {products.map((product, index) => (
              <ProductSummary
                key={product.productId}
                syncProduct={product}
                lazyLoad={index > 3}
              />
            ))}
          </>
        }
      >
        <Page
          offset={offset}
          withSWR={withSWR}
          categoryId={categoryId}
          products={products}
        />
      </SuspenseSSR>
    ),
    // {
    //   const page = offset ?? 1
    //   const { from, to } = ranges(page)
    //   const isSync = page === 1 && products.length > 0

    //   const url = api.search({
    //     categoryIds: [`${categoryId}`],
    //     from,
    //     to,
    //   })

    //   const initialData = isSync
    //     ? {
    //         products: products.slice(0, PAGE_SIZE),
    //         total: Infinity,
    //         range: { from, to },
    //       }
    //     : undefined

    //   const { data } = withSWR(useSWR(url, productListFetcher, { initialData }))

    //   if (!data) {
    //     return null
    //   }

    //   return data.products.map((product, index) => (
    //     <ProductSummary
    //       key={product.productId}
    //       syncProduct={product}
    //       lazyLoad={index > 3}
    //     />
    //   ))
    // },
    nextPage,
    [products]
  )

  // Prefetch next page
  useEffect(() => {
    import('./lazy').then((lib) => lib.prefetchPage(categoryId, pageCount + 1))
  }, [categoryId, pageCount])

  return (
    <>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {pages}
      </Grid>
      {isReachingEnd ? null : (
        <Button variant="loadMore" onClick={loadMore} disabled={isLoadingMore}>
          {isLoadingMore ? 'Loading...' : 'More'}
        </Button>
      )}
    </>
  )
}

export default ProductList
