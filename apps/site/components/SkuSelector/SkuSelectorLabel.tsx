import React, { useCallback, useMemo } from 'react'
import { SkuSelector, SkuOption } from '@faststore/ui'

import { getSkuSlug } from './skuVariants'

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

  const [skuPropertyName] = useMemo(() => {
    return Object.keys(product.isVariantOf.skuVariants.activeVariations)
  }, [product.isVariantOf.skuVariants.activeVariations])

  const getItemHref = useCallback(
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
      skuPropertyName="Size"
      options={product.isVariantOf.skuVariants.availableVariations.Size}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      getItemHref={getItemHref}
    />
  )
}

export default SkuSelectorLabel
