import React, { useCallback, useMemo } from 'react'
import { SkuSelector, SkuSelectorProps, SkuOption } from '@faststore/ui'

import { product } from '../../mocks/product'

import { getSkuSlug } from './skuVariants'

const SkuSelectorLabel = () => {
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
      label: '40',
      value: '40',
    },
    {
      alt: 'skuvariation',
      label: '41',
      value: '41',
    },
    {
      alt: 'skuvariation',
      label: '42',
      value: '42',
      disabled: true,
    },
  ]

  return (
    <SkuSelector
      variant="label"
      skuPropertyName="Size"
      options={options}
      LinkComponent={LinkComponent}
      activeVariations={product.isVariantOf.skuVariants.activeVariations}
      mountItemHref={mountItemHref}
    />
  )
}

export default SkuSelectorLabel
