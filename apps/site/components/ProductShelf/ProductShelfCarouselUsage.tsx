/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  Carousel,
  ProductCard,
  ProductCardImage,
  ProductCardContent,
  ProductShelf,
  ProductShelfItems,
} from '@faststore/ui'

import { products } from 'site/mocks/products'
import { useFormattedPrice } from '../utilities/usePriceFormatter'

const ProductShelfCarouselUsage = () => {
  const isMobile = window.innerWidth <= 768

  return (
    <ProductShelf>
      <ProductShelfItems
        style={{ width: '100%', overflow: 'hidden', padding: '0 30px' }}
      >
        <Carousel
          itemsPerPage={isMobile ? 1 : 3}
          variant="scroll"
          infiniteMode={false}
        >
          {products.map(({ product }, idx) => (
            <ProductCard>
              <ProductCardImage>
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
              />
            </ProductCard>
          ))}
        </Carousel>
      </ProductShelfItems>
    </ProductShelf>
  )
}

export default ProductShelfCarouselUsage
