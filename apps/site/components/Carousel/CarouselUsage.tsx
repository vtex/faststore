/* eslint-disable @next/next/no-img-element */
import React, { PropsWithChildren } from 'react'
import {
  Carousel,
  ProductCard,
  ProductCardImage,
  ProductCardContent,
} from '@faststore/ui'

import { products } from 'site/mocks/products'
import { useFormattedPrice } from '../utilities/usePriceFormatter'

export type CarouselUsageProps = {
  itemsPerPage: number
}

export const CarouselUsage = ({
  itemsPerPage = 3,
}: PropsWithChildren<CarouselUsageProps>) => {
  const isMobile = window.innerWidth <= 768
  return (
    <Carousel
      itemsPerPage={isMobile ? 1 : itemsPerPage}
      variant="scroll"
      infiniteMode={false}
    >
      {products.map(({ product }, idx) => (
        <ProductCard key={idx}>
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
  )
}

export default CarouselUsage
