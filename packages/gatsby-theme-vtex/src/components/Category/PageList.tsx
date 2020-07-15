/* eslint-disable react-hooks/rules-of-hooks */
import { Category } from '@vtex/gatsby-source-vtex'
import React, { FC, Fragment, lazy, useCallback, useState } from 'react'
import { Grid, Spinner } from 'theme-ui'

import { SuspenseSSR } from '../SuspenseSSR'
import FetchMoreBtn from './FetchMore'
import Page from './SyncPage'

const AsyncPage = lazy(() => import('./AsyncPage'))

const AsyncPageList = lazy(() => import('./AsyncPageList'))

interface Props {
  category: Category
}

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [loading, setLoading] = useState(products.length === 0)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [size, setSize] = useState(2)
  const fetchMore = useCallback(() => setSize((s) => s + 1), [])

  const hasSyncPage = products.length > 0

  return (
    <Fragment>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {hasSyncPage ? (
          <Page products={products} />
        ) : (
          <SuspenseSSR fallback={<Spinner />}>
            <AsyncPage page={0} categoryId={categoryId} />
          </SuspenseSSR>
        )}
        <SuspenseSSR fallback={null}>
          <AsyncPageList
            categoryId={categoryId}
            targetSize={size}
            setLoading={setLoading}
            setReachedEnd={setReachedEnd}
            resetSize={setSize}
          />
        </SuspenseSSR>
      </Grid>
      {reachedEnd ? null : (
        <FetchMoreBtn
          onClick={fetchMore}
          disabled={reachedEnd || loading}
          loading={loading}
        />
      )}
    </Fragment>
  )
}

export default List
