/* eslint-disable react-hooks/rules-of-hooks */
import { Category } from '@vtex/gatsby-source-vtex'
import React, { FC, Fragment, lazy, useEffect, useState } from 'react'

import { SuspenseSSR } from '../SuspenseSSR'
import { Props as AsyncPageProps } from './AsyncPageList'
import Page from './SyncPage'
import FetchMoreBtn from './FetchMore'

const AsyncPageList = lazy(() => import('./AsyncPageList'))

interface Props {
  category: Category
}

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [renderAsyncList, setRenderAsyncList] = useState(products.length === 0)
  const SyncPage = products.length > 0 ? <Page products={products} /> : null

  useEffect(() => {
    import('./AsyncPageList').then(() => setRenderAsyncList(true))
  })

  return (
    <Fragment>
      {SyncPage}
      {renderAsyncList ? (
        <SuspenseSSR fallback={null}>
          <AsyncPageList categoryId={categoryId} offset={SyncPage ? 2 : 1} />
        </SuspenseSSR>
      ) : null}
    </Fragment>
  )
}

export default List
