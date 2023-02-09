import React from 'react'
import { SkuSelector } from '@faststore/ui'

const SkuSelectorColor = () => {
  const renderLinkFunction = (href: string) => (
    <a data-fs-sku-selector-option-link href={href} />
  )

  const options = [
    {
      alt: 'skuvariation',
      href: '/product-lalala',
      value: 'Blue',
      hexColor: '#6bb5ff',
      renderLink: renderLinkFunction,
    },
    {
      alt: 'skuvariation',
      href: '/product-lalala',
      value: 'Yellow',
      hexColor: '#e5c45f',
      renderLink: renderLinkFunction,
    },
    {
      alt: 'skuvariation',
      href: '/product-lalala',
      disabled: true,
      value: 'Gray',
      hexColor: '#dfdfdf',
      renderLink: renderLinkFunction,
    },
  ]

  return (
    <SkuSelector
      activeValue="Blue"
      label="Color"
      id="color"
      variant="color"
      options={options}
    />
  )
}

export default SkuSelectorColor
