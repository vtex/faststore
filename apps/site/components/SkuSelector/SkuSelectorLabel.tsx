import React from 'react'
import { SkuSelector } from '@faststore/ui'

const SkuSelectorLabel = () => {
  const renderLinkFunction = (href: string) => (
    <a data-fs-sku-selector-option-link href={href} />
  )

  const options = [
    {
      alt: 'skuvariation',
      href: '/product-lalala',
      value: '40',
      renderLink: renderLinkFunction,
    },
    {
      alt: 'skuvariation',
      href: '/product-lalala',
      value: '41',
      renderLink: renderLinkFunction,
    },
    {
      alt: 'skuvariation',
      href: '/product-lalala',
      disabled: true,
      value: '42',
      renderLink: renderLinkFunction,
    },
  ]

  return (
    <SkuSelector
      activeValue="41"
      label="Size"
      id="size"
      variant="label"
      options={options}
    />
  )
}

export default SkuSelectorLabel
