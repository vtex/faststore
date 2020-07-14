/* eslint-disable react-hooks/rules-of-hooks */
import { Category } from '@vtex/gatsby-source-vtex'
import React, { FC, Fragment, lazy, useEffect, useState } from 'react'

import { SuspenseSSR } from '../SuspenseSSR'
import Page from './SyncPage'
import FetchMoreBtn from './FetchMore'

const loadAsyncPageList = () => import('./AsyncPageList')
const AsyncPageList = lazy(loadAsyncPageList)

interface Props {
  category: Category
}

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [renderAsyncList, setRenderAsyncList] = useState(products.length === 0)
  const SyncPage = products.length > 0 ? <Page products={products} /> : null
  const offset = SyncPage ? 2 : 1

  // Preload when idle
  useEffect(() => {
    const idleCallback = (window as any).requestIdleCallback

    if (typeof idleCallback !== 'function') {
      return
    }

    idleCallback(async () => {
      if (renderAsyncList) {
        return // PageList was already loaded
      }

      const lib = await loadAsyncPageList()

      if (typeof lib?.prefetchPageData === 'function') {
        lib.prefetchPageData(offset, categoryId)
      }
    })
  })

  return (
    <Fragment>
      {SyncPage}
      {renderAsyncList ? (
        <SuspenseSSR fallback={null}>
          <AsyncPageList categoryId={categoryId} offset={offset} />
        </SuspenseSSR>
      ) : null}
      {renderAsyncList ? null : (
        <FetchMoreBtn
          onClick={() => setRenderAsyncList(true)}
          disabled={false}
          loading={false}
        />
      )}
    </Fragment>
  )
}

export default List
