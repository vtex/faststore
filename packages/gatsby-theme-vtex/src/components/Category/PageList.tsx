/* eslint-disable react-hooks/rules-of-hooks */
import { Category } from '@vtex/gatsby-source-vtex'
import React, {
  FC,
  Fragment,
  lazy,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Grid } from 'theme-ui'

import { useSearchFilters } from '../../providers/SearchFilter'
import SuspenseDelay from '../SuspenseDelay'
import SuspenseSSR from '../SuspenseSSR'
import FetchMoreBtn from './FetchMore'
import OverlaySpinner from './OverlaySpinner'
import Page from './SyncPage'

const AsyncPage = lazy(() => import('./AsyncPage'))

const AsyncPageList = lazy(() => import('./AsyncPageList'))

interface Props {
  category: Category
}

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [filters] = useSearchFilters()
  const [loading, setLoading] = useState(products.length === 0)
  const [reachedEnd, setReachedEnd] = useState(false)
  const [size, setSize] = useState(2)
  const fetchMore = useCallback(() => setSize((s) => s + 1), [])
  const hasFilters = useMemo(() => Object.values(filters).some((v) => !!v), [
    filters,
  ])

  const hasSyncPage = products.length > 0 && !hasFilters

  return (
    <Fragment>
      <Grid my={4} gap={3} columns={[1, 2, 3, 4]}>
        {hasSyncPage ? (
          <Page products={products} />
        ) : (
          <SuspenseSSR fallback={<OverlaySpinner />}>
            <AsyncPage page={0} categoryId={categoryId} />
          </SuspenseSSR>
        )}
        <SuspenseDelay fallback={null}>
          <AsyncPageList
            categoryId={categoryId}
            targetSize={size}
            setLoading={setLoading}
            setReachedEnd={setReachedEnd}
            resetSize={setSize}
          />
        </SuspenseDelay>
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
