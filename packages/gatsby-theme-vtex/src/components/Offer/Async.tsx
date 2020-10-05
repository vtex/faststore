import React, { FC } from 'react'

import { useAsyncProduct } from '../ProductPage/useAsyncProduct'
import { useSku } from '../../sdk/product/useSku'
import SyncOffer from './Sync'

export interface Props {
  slug: string
  skuId?: string
  variant?: string
}

const AsyncOffer: FC<Props> = ({ slug, skuId, variant = '' }) => {
  const { product }: any = useAsyncProduct({ slug })
  const sku = useSku(product, skuId)

  return <SyncOffer sku={sku as any} variant={variant} />
}

export default AsyncOffer
