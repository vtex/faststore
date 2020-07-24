import React, { FC, useMemo } from 'react'

import { useAsyncProduct, useSku } from '../../providers/Product'
import { findBestSeller } from '../../utils/seller'
import SyncOffer from './Sync'

export interface Props {
  productId: string
  skuId?: string
}

const AsyncOffer: FC<Props> = ({ productId, skuId }) => {
  const { product } = useAsyncProduct({ productIds: [productId] })
  const sku = useSku(product, skuId)
  const seller = useMemo(() => sku && findBestSeller(sku), [sku])
  const offer = seller?.commertialOffer

  return <SyncOffer offer={offer} variant="productDetails" />
}

export default AsyncOffer
