import React, { FC } from 'react'

import { useAsyncProduct, useSku } from '../../providers/Product'
import SyncOffer from './Sync'
import OfferPreview from './Preview'

export interface Props {
  slug: string
  skuId?: string
  variant?: string
}

const AsyncOffer: FC<Props> = ({ slug, skuId, variant = '' }) => {
  const { product, isLoading } = useAsyncProduct(slug)
  const sku = useSku(product, skuId)

  if (isLoading) {
    return <OfferPreview variant={variant} />
  }

  return <SyncOffer sku={sku} variant={variant} />
}

export default AsyncOffer
