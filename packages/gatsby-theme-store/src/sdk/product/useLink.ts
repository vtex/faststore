import type { MouseEvent } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useSku } from './useSku'
import type { ProductSummary_ProductFragment } from '../../components/ProductSummary/__generated__/ProductSummary_product.graphql'

export const useLink = (product: ProductSummary_ProductFragment) => {
  const [{ itemId }] = useSku(product as any)

  return {
    to: `/${product.linkText}/p?skuId=${itemId}`,
    onClick: (_: MouseEvent<HTMLAnchorElement>) =>
      sendPixelEvent({
        type: 'vtex:productClick',
        data: {
          product,
        },
      }),
  }
}
