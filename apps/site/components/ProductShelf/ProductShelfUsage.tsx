/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductShelf,
  ProductShelfItems,
  ProductShelfItem,
} from '@faststore/ui'

import { products } from 'site/mocks/products'
import { useFormattedPrice } from '../utilities/usePriceFormatter'

export interface ProductShelfUsageProps {
  withButton?: boolean
  bordered?: boolean
  aspectRatio?: number
  items?: number
}

const ProductShelfUsage = ({
  withButton,
  bordered,
  aspectRatio,
  items = 10,
}: ProductShelfUsageProps) => {
  const productsArray = items ? products.slice(0, items) : products

  return (
    <ProductShelf>
      <ProductShelfItems>
        {productsArray.map(({ product }, idx) => (
          <ProductShelfItem key={idx}>
            <ProductCard bordered={bordered}>
              <ProductCardImage aspectRatio={aspectRatio}>
                <img
                  data-fs-image
                  src={product.image[0].url}
                  alt={product.image[0].alternateName}
                />
              </ProductCardImage>
              <ProductCardContent
                title={product.isVariantOf.name}
                price={{
                  value: product.offers.offers[0].price,
                  listPrice: product.offers.offers[0].listPrice,
                  formatter: useFormattedPrice,
                }}
                onButtonClick={withButton ? () => {} : null}
              />
            </ProductCard>
          </ProductShelfItem>
        ))}
      </ProductShelfItems>
    </ProductShelf>
  )
}

export default ProductShelfUsage
