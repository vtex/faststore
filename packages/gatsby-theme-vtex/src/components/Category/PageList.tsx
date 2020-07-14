/* eslint-disable react-hooks/rules-of-hooks */
import { Category } from '@vtex/gatsby-source-vtex'
import React, { FC, Fragment, lazy, useEffect, useState } from 'react'

import { SuspenseSSR } from '../SuspenseSSR'
import Page from './SyncPage'
import FetchMoreBtn from './FetchMore'

interface Props {
  category: Category
}

const loadAsyncPageList = () => import('./AsyncPageList')

const AsyncPageList = lazy(loadAsyncPageList)

// load AsyncPageList when idle
;(window as any).requestIdleCallback?.(loadAsyncPageList)

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [renderAsyncList, setRenderAsyncList] = useState(products.length === 0)
  const SyncPage = products.length > 0 ? <Page products={products} /> : null
  const offset = SyncPage ? 1 : 0

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
