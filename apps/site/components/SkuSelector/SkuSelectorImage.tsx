import React from 'react'
import { SkuSelector } from '@faststore/ui'

const SkuSelectorImage = () => {
  const renderImageFunction = (src: string, alt: string) => (
    <img data-fs-sku-selector-option-image src={src} alt={alt} />
  )
  const renderLinkFunction = (href: string) => (
    <a data-fs-sku-selector-option-link href={href} />
  )

  const options = [
    {
      alt: 'skuvariation',
      src: 'https://storeframework.vtexassets.com/arquivos/ids/190932/mouse-black.jpg?v=1759260622',
      href: '/product-lalala',
      value: 'Black',
      renderLink: renderLinkFunction,
      renderImage: renderImageFunction,
    },
    {
      alt: 'skuvariation',
      src: 'https://storeframework.vtexassets.com/arquivos/ids/190902/unsplash-magic-mouse.jpg?v=1759260622',
      href: '/product-lalala',
      value: 'White',
      renderLink: renderLinkFunction,
      renderImage: renderImageFunction,
    },
    {
      alt: 'skuvariation',
      src: 'https://storeframework.vtexassets.com/arquivos/ids/190902/unsplash-magic-mouse.jpg?v=1759260622',
      href: '/product-lalala',
      value: 'Gray',
      disabled: true,
      renderLink: renderLinkFunction,
      renderImage: renderImageFunction,
    },
  ]

  return (
    <SkuSelector
      activeValue="Black"
      label="Color"
      id="color-image"
      variant="image"
      options={options}
    />
  )
}

export default SkuSelectorImage
