/* eslint-disable react-hooks/rules-of-hooks */
/** @jsx jsx */
import { Category } from '@vtex/gatsby-source-vtex'
import {
  FC,
  Fragment,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Button, jsx } from 'theme-ui'

import { Props as AsyncPageProps } from './AsyncPage'
import Page from './SyncPage'

const AsyncPage = lazy(() => import('./AsyncPage'))

interface Props {
  category: Category
}

const SuspensePage: FC<AsyncPageProps> = (props) => (
  <Suspense fallback={null}>
    <AsyncPage {...props} />
  </Suspense>
)

const List: FC<Props> = ({ category: { products, categoryId } }) => {
  const [isLoadingMore, setLoadingMore] = useState(products.length === 0)
  const [nextPage, setNextPage] = useState<number | null>(2)
  const [pages, setPages] = useState(() =>
    products.length === 0
      ? [
          <SuspensePage
            key="suspense-page-0"
            page={1}
            categoryId={categoryId}
            setNextPage={setNextPage}
            setLoadingMore={setLoadingMore}
          />,
        ]
      : [<Page key="static-page" products={products} />]
  )

  const loadMore = useCallback(() => {
    setLoadingMore(true)
    setPages((p) => {
      const next = pages.length + 1
      const page = (
        <SuspensePage
          key={`suspense-page-${next}`}
          page={next}
          categoryId={categoryId}
          setNextPage={setNextPage}
          setLoadingMore={setLoadingMore}
        />
      )

      return [...p, page]
    })
  }, [categoryId, pages])

  // Prefetch next page
  useEffect(() => {
    import('./AsyncPage').then((lib) =>
      lib.prefetchPage(pages.length + 1, categoryId)
    )
  }, [categoryId, pages.length])

  return (
    <Fragment>
      {pages}
      {nextPage && (
        <Button
          sx={{ width: '100%', my: 4 }}
          variant="loadMore"
          onClick={loadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? 'Loading...' : 'More'}
        </Button>
      )}
    </Fragment>
  )
}

export default List
