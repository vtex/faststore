import React, { useCallback, useMemo } from 'react'
import { SkuSelector, SkuSelectorProps, SkuOption } from '@faststore/ui'

import { product } from '../../mocks/product'

import { getSkuSlug } from './skuVariants'

const SkuSelectorImage = () => {
  const [skuPropertyName] = useMemo(() => {
    return Object.keys(product.isVariantOf.skuVariants.activeVariations)
  }, [])

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
    [skuPropertyName]
  )

  const ImageComponent: SkuSelectorProps['ImageComponent'] = ({
    src,
    alt,
    ...otherProps
  }) => <img src={src} alt={alt} {...otherProps} />

  return (
    <SkuSelector
      skuPropertyName={skuPropertyName}
      options={
        product.isVariantOf.skuVariants.availableVariations[skuPropertyName]
      }
      ImageComponent={ImageComponent}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      getItemHref={getItemHref}
    />
  )
}

export default SkuSelectorImage
