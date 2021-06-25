import type { MouseEvent } from 'react'

import { sendPixelEvent } from '../pixel/usePixelSendEvent'
import { useSku } from './useSku'

export const useLink = (product: any) => {
  const [{ itemId }] = useSku(product)

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
