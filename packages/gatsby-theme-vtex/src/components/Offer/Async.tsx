import React, { FC } from 'react'

import { useAsyncProduct, useSku } from '../../providers/Product'
import SyncOffer from './Sync'
import OfferPreview from './Preview'

export interface Props {
  productId: string
  skuId?: string
}

const AsyncOffer: FC<Props> = ({ productId, skuId }) => {
  const { product, isLoading } = useAsyncProduct({ productIds: [productId] })
  const sku = useSku(product, skuId)

  if (isLoading) {
    return <OfferPreview />
  }

  return <SyncOffer sku={sku} />
}

export default AsyncOffer
