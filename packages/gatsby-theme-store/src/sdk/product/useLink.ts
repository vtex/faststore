import { MouseEvent } from 'react'

import { useSku } from './useSku'
import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { ProductSummary_ProductFragment } from '../../components/ProductSummary/__generated__/ProductSummary_product.graphql'

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
