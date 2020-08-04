import React, { FC } from 'react'

import { useAsyncProduct, useSku } from '../../providers/Product'
import BuyButtonPreview from './Preview'
import BuyButtonImp from './BuyButton'

export interface Props {
  slug: string
  skuId?: string
}

const BuyButton: FC<Props> = ({ slug, skuId }) => {
  const { product, isLoading } = useAsyncProduct(slug)
  const sku = useSku(product, skuId)

  if (isLoading || !sku) {
    return <BuyButtonPreview disabled={!product} />
  }

  return <BuyButtonImp sku={sku} />
}

export default BuyButton
