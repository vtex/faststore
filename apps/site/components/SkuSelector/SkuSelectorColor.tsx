import React from 'react'
import { SkuSelector } from '@faststore/ui'

const SkuSelectorColor = () => {
  const product = {
    name: 'Tech Keyboard',
    isVariantOf: {
      name: 'Tech Keyboard',
      productGroupID: '99995945',
      skuVariants: {
        activeVariations: {
          Color: 'Blue',
        },
        slugsMap: {
          'Color-Blue': 'tech-keyboard-99988216',
          'Color-Yellow': 'tech-keyboard-99988212',
          'Color-Gray': 'tech-keyboard-99988210',
        },
        availableVariations: {
          Color: [
            {
              hexColor: '#6bb5ff',
              alt: 'skuvariation',
              label: 'Color: Blue',
              value: 'Blue',
            },
            {
              hexColor: '#e5c45f',
              alt: 'skuvariation',
              label: 'Color: Yellow',
              value: 'Yellow',
            },
            {
              hexColor: '#dfdfdf',
              alt: 'skuvariation',
              label: 'Color: Gray',
              value: 'Gray',
              disabled: true,
            },
          ],
        },
      },
    },
  }

  return (
    <SkuSelector
      skuPropertyName="Color"
      availableVariations={product.isVariantOf.skuVariants.availableVariations}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      slugsMap={product.isVariantOf.skuVariants.slugsMap}
    />
  )
}

export default SkuSelectorColor
