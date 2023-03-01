import React, { useCallback, useMemo } from 'react'
import { SkuSelector, SkuSelectorProps, SkuOption } from '@faststore/ui'

import { getSkuSlug } from './skuVariants'

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

  const [skuPropertyName] = useMemo(() => {
    return Object.keys(product.isVariantOf.skuVariants.activeVariations)
  }, [product.isVariantOf.skuVariants.activeVariations])

  const mountItemHref = useCallback(
    (option: SkuOption) => {
      const currentOptionName = skuPropertyName ?? option.label.split(':')[0]
      const currentItemHref = `/${getSkuSlug(
        product.isVariantOf.skuVariants.slugsMap,
        {
          ...product.isVariantOf.skuVariants.activeVariations,
          [currentOptionName]: option.value,
        },
        skuPropertyName
      )}/p`
      return currentItemHref
    },
    [
      product.isVariantOf.skuVariants.activeVariations,
      product.isVariantOf.skuVariants.slugsMap,
      skuPropertyName,
    ]
  )

  return (
    <SkuSelector
      variant="color"
      skuPropertyName="Color"
      options={product.isVariantOf.skuVariants.availableVariations.Color}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      mountItemHref={mountItemHref}
    />
  )
}

export default SkuSelectorColor
