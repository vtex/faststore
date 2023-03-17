import React from 'react'
import { SkuSelector } from '@faststore/ui'

import { product } from '../../mocks/product'

const SkuSelectorImage = () => {
  return (
    <SkuSelector
      skuPropertyName="Color"
      availableVariations={
        product.isVariantOf.skuVariants.availableVariations
      }
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      slugsMap={product.isVariantOf.skuVariants.slugsMap}
    />
  )
}

export default SkuSelectorImage
