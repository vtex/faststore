import React from 'react'
import { SkuSelector } from '@faststore/ui'

const SkuSelectorLabel = () => {
  const product = {
    name: 'Tech Shirt',
    isVariantOf: {
      name: 'Tech Shirt',
      productGroupID: '99995945',
      skuVariants: {
        activeVariations: {
          Size: '40',
        },
        slugsMap: {
          'Size-40': 'tech-shirt-99988216',
          'Size-41': 'tech-shirt-99988212',
          'Size-42': 'tech-shirt-99988210',
        },
        availableVariations: {
          Size: [
            {
              alt: 'skuvariation',
              label: 'Size: 40',
              value: '40',
            },
            {
              alt: 'skuvariation',
              label: 'Size: 41',
              value: '41',
            },
            {
              alt: 'skuvariation',
              label: 'Size: 42',
              value: '42',
              disabled: true,
            },
          ],
        },
      },
    },
  }

  return (
    <SkuSelector
      skuPropertyName="Size"
      availableVariations={product.isVariantOf.skuVariants.availableVariations}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      slugsMap={product.isVariantOf.skuVariants.slugsMap}
    />
  )
}

export default SkuSelectorLabel
