/* eslint-disable react-hooks/rules-of-hooks */
import { Category } from '@vtex/gatsby-source-vtex'
import React, {
  FC,
  Fragment,
  lazy,
  useCallback,
  useState,
  useEffect,
} from 'react'
import { Grid } from 'theme-ui'

import { SuspenseSSR } from '../SuspenseSSR'
import FetchMoreBtn from './FetchMore'
import Page from './SyncPage'

interface Props {
  category: Category
}

const loadAsyncPageList = () => import('./AsyncPageList')

const AsyncPageList = lazy(loadAsyncPageList)

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [renderAsyncList, setRenderAsyncList] = useState(products.length === 0)
  const [loading, setLoading] = useState(products.length === 0)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [size, setSize] = useState(2)
  const fetchMore = useCallback(() => {
    setSize((s) => s + 1)
    setRenderAsyncList(true)
  }, [])

  const SyncPage = products.length > 0 ? <Page products={products} /> : null
  const offset = SyncPage ? 1 : 0

  // load AsyncPageList when idle
  useEffect(() => {
    const onIdle = async () => {
      await loadAsyncPageList()
      setRenderAsyncList(true)
    }

    const handle = (window as any).requestIdleCallback?.(onIdle)

    return () => (window as any).cancelIdleCallback?.(handle)
  }, [])

  return (
    <Fragment>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {SyncPage}
        {renderAsyncList ? (
          <SuspenseSSR fallback={null}>
            <AsyncPageList
              categoryId={categoryId}
              preload={size === 2 && SyncPage !== null}
              offset={offset}
              targetSize={size}
              setLoading={setLoading}
              setReachedEnd={setReachedEnd}
            />
          </SuspenseSSR>
        ) : null}
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
