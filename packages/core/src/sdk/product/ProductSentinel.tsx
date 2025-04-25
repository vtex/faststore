import { useEffect, type PropsWithChildren } from 'react'
import { useInView } from 'react-intersection-observer'

import type { ProductSummary_ProductFragment } from '@generated/graphql'

import { useViewItemListEvent } from '../analytics/hooks/useViewItemListEvent'
import { queueViewItemList } from './viewItemListQueue'

interface ProductSentinelProps {
  /**
   * Title for the `ProductSentinel` component.
   */
  title: string
  /**
   * Product listed on the grid.
   */
  product: ProductSummary_ProductFragment
  /**
   * The page's number that the Product is being rendered.
   */
  page: number
  /**
   * Quantity of products listed by page.
   */
  pageSize: number
}

/**
 * Use this component to add a boundary between Products to send the right view_item_list event to GA in ProductGallery
 */
export function ProductSentinel({
  product,
  title,
  page,
  pageSize,
  children,
}: PropsWithChildren<ProductSentinelProps>) {
  const { ref, inView } = useInView()

  const { sendViewItemListEvent } = useViewItemListEvent({
    title,
    page,
    pageSize,
  })

  useEffect(() => {
    if (inView) {
      queueViewItemList({ product, sendViewItemListEvent })
    }
  }, [inView, product])

  return (
    // minHeight to avoid the layout shift when the sentinel is not in view, '15.225rem' is the min value from the Product Card
    <div ref={ref} style={{ minHeight: '15.225rem' }}>
      {children}
    </div>
  )
}

export default ProductSentinel
