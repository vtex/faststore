import React, { FC, lazy } from 'react'

import { useAsyncProduct, useSku } from '../../providers/Product'
import BuyButtonPreview from './Preview'

const BuyButtonImp = lazy(() => import('./BuyButton'))

export interface Props {
  productId: string
  skuId?: string
}

const BuyButton: FC<Props> = ({ productId, skuId }) => {
  const { product, isLoading } = useAsyncProduct({ productIds: [productId] })
  const sku = useSku(product, skuId)

  if (isLoading || !sku) {
    return <BuyButtonPreview disabled={!product} />
  }

  return <BuyButtonImp sku={sku} />
}

export default BuyButton
