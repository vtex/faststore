import React, { FC } from 'react'

import { useAsyncProduct, useSku } from '../../providers/Product'
import BuyButtonPreview from './Preview'
import BuyButtonImp from './BuyButton'

export interface Props {
  productId: string
  skuId?: string
}

const BuyButton: FC<Props> = ({ productId, skuId }) => {
  const { product, isLoading } = useAsyncProduct({ productIds: [productId] })
  const sku = useSku(product, skuId)

  if (isLoading || !sku) {
    return <BuyButtonPreview key="BuyButtonPreviewAsync" disabled={!product} />
  }

  return <BuyButtonImp key="BuyButtonImplAsync" sku={sku} />
}

export default BuyButton
