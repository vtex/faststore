import { MouseEvent } from 'react'

import { ProductSummary_ProductFragment } from '../../components/ProductSummary/__generated__/ProductSummary_product.graphql'
import { sendPixelEvent } from '../pixel/usePixelSendEvent'

export const useLink = (product: ProductSummary_ProductFragment) => ({
  to: `/${product.linkText}/p`,
  onClick: (_: MouseEvent<HTMLAnchorElement>) =>
    sendPixelEvent({
      type: 'vtex:productClick',
      data: {
        product,
      },
    }),
})
