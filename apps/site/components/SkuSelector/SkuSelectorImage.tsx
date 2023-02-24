import React, { useCallback, useMemo } from 'react'
import { SkuSelector, SkuSelectorProps, SkuOption } from '@faststore/ui'

import { product } from '../../mocks/product'

import { getSkuSlug } from './skuVariants'

const SkuSelectorImage = () => {
  const ImageComponent: SkuSelectorProps['ImageComponent'] = ({
    src,
    alt,
    ...otherProps
  }) => <img src={src} alt={alt} {...otherProps} />

  const LinkComponent: SkuSelectorProps['LinkComponent'] = ({
    href,
    children,
    ...otherProps
  }) => (
    <a href={href} {...otherProps}>
      {children}
    </a>
  )

  const [skuPropertyName] = useMemo(() => {
    return Object.keys(product.isVariantOf.skuVariants.activeVariations)
  }, [])

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
    [skuPropertyName]
  )

  return (
    <SkuSelector
      variant="image"
      skuPropertyName={skuPropertyName}
      options={
        product.isVariantOf.skuVariants.availableVariations[skuPropertyName]
      }
      LinkComponent={LinkComponent}
      ImageComponent={ImageComponent}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      mountItemHref={mountItemHref}
    />
  )
}

export default SkuSelectorImage
