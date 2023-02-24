import React, { useCallback, useMemo } from 'react'
import { SkuSelector, SkuSelectorProps, SkuOption } from '@faststore/ui'

import { product } from '../../mocks/product'

import { getSkuSlug } from './skuVariants'

const SkuSelectorColor = () => {
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

  const options = [
    {
      alt: 'skuvariation',
      label: 'Blue',
      value: 'Blue',
      hexColor: '#6bb5ff',
    },
    {
      alt: 'skuvariation',
      label: 'Yellow',
      value: 'Yellow',
      hexColor: '#e5c45f',
    },
    {
      alt: 'skuvariation',
      label: 'Gray',
      value: 'Gray',
      hexColor: '#dfdfdf',
      disabled: true,
    },
  ]

  return (
    <SkuSelector
      variant="color"
      skuPropertyName="Color"
      options={options}
      LinkComponent={LinkComponent}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      mountItemHref={mountItemHref}
    />
  )
}

export default SkuSelectorColor
