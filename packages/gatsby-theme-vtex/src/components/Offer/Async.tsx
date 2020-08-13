import React, { FC } from 'react'

import { useAsyncProduct, useSku } from '../../sdk/product/useAsyncProduct'
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

  return <SyncOffer sku={sku as any} variant={variant} />
}

export default AsyncOffer
